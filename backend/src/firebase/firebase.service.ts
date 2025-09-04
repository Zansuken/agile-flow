import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firestore: admin.firestore.Firestore;
  private auth: admin.auth.Auth;
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;

  constructor(private configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.initializeFirebase();
    return this.initializationPromise;
  }

  private async initializeFirebase(): Promise<void> {
    try {
      const firebaseConfig = {
        type: 'service_account',
        project_id: this.configService.get<string>('FIREBASE_PROJECT_ID'),
        private_key_id: this.configService.get<string>(
          'FIREBASE_PRIVATE_KEY_ID',
        ),
        private_key: this.configService
          .get<string>('FIREBASE_PRIVATE_KEY')
          ?.replace(/\\n/g, '\n'),
        client_email: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
        client_id: this.configService.get<string>('FIREBASE_CLIENT_ID'),
        auth_uri: this.configService.get<string>('FIREBASE_AUTH_URI'),
        token_uri: this.configService.get<string>('FIREBASE_TOKEN_URI'),
        auth_provider_x509_cert_url: this.configService.get<string>(
          'FIREBASE_AUTH_PROVIDER_X509_CERT_URL',
        ),
      };

      // Only initialize if not already initialized
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(
            firebaseConfig as admin.ServiceAccount,
          ),
          projectId: firebaseConfig.project_id,
        });
        console.log('✅ Firebase Admin initialized successfully');
      } else {
        console.log('✅ Firebase Admin already initialized');
      }

      this.firestore = admin.firestore();
      this.auth = admin.auth();

      // Configure Firestore settings
      this.firestore.settings({
        ignoreUndefinedProperties: true,
      });

      // Test the connection with a simple operation
      await this.testConnection();

      this.isInitialized = true;
      console.log('✅ Firebase services are ready');
    } catch (error) {
      console.error('❌ Firebase initialization failed:', error);
      throw error;
    }
  }

  private async testConnection(): Promise<void> {
    try {
      // Simple test to verify connectivity
      await this.auth.getUser('test-connection').catch((error: unknown) => {
        // Expected to fail, but should not be a network error
        const errorCode =
          typeof error === 'object' && error !== null && 'code' in error
            ? String((error as { code: unknown }).code)
            : 'unknown';

        if (errorCode !== 'auth/user-not-found') {
          throw error;
        }
      });
    } catch (error) {
      console.warn('Firebase connection test warning:', error);
      // Don't throw here as this might be expected in some cases
    }
  }

  async waitForInitialization(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (this.initializationPromise) {
      await this.initializationPromise;
    } else {
      await this.onModuleInit();
    }
  }

  getFirestore(): admin.firestore.Firestore {
    if (!this.isInitialized) {
      throw new Error(
        'Firebase not initialized. Call waitForInitialization() first.',
      );
    }
    return this.firestore;
  }

  getAuth(): admin.auth.Auth {
    if (!this.isInitialized) {
      throw new Error(
        'Firebase not initialized. Call waitForInitialization() first.',
      );
    }
    return this.auth;
  }

  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    await this.waitForInitialization();
    return this.auth.verifyIdToken(idToken);
  }

  isReady(): boolean {
    return this.isInitialized;
  }
}
