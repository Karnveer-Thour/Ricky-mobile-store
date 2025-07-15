import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { firebaseConfig } from './firebase.config';

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig as admin.ServiceAccount),
      });


    }
  }

  getAuth() {
    return admin.auth();
  }

  getMessaging() {
    return admin.messaging();
  }
}