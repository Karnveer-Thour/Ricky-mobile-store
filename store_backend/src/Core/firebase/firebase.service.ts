import { Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { firebaseConfig } from './firebase.config';
import { role } from 'Modules/User/Model/Role.model';

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig as admin.ServiceAccount),
      });
    }
  }

  async verifyToken(idToken: string) {
    try {
      const decoded = await admin.auth().verifyIdToken(idToken);
      return decoded;
    } catch (err) {
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }

  async createUser(email: string, password: string) {
    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
      });
      return userRecord;
    } catch (error) {
      console.error('Error creating Firebase user:', error);
      throw error;
    }
  }

  getAuth() {
    return admin.auth();
  }

  getMessaging() {
    return admin.messaging();
  }
}
