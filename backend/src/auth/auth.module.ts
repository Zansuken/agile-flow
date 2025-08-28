import { Module } from '@nestjs/common';
import { FirebaseModule } from '../firebase/firebase.module';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [FirebaseModule],
  providers: [AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}
