import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firestore: admin.firestore.Firestore;
  private auth: admin.auth.Auth;

  constructor(private configService: ConfigService) {}

  onModuleInit(): void {
    const firebaseConfig = {
      type: 'service_account',
      project_id: this.configService.get<string>('FIREBASE_PROJECT_ID'),
      private_key_id: this.configService.get<string>('FIREBASE_PRIVATE_KEY_ID'),
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
  }

  getFirestore(): admin.firestore.Firestore {
    return this.firestore;
  }

  getAuth(): admin.auth.Auth {
    return this.auth;
  }

  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    return this.auth.verifyIdToken(idToken);
  }
}
