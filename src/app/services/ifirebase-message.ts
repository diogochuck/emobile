import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getMessaging,
  Messaging,
  getToken,
  onMessage,
  MessagePayload,
  Unsubscribe,
} from 'firebase/messaging';
import { onBackgroundMessage } from 'firebase/messaging/sw';

export interface IFirebaseMessage {
  initialize(): void;

  firebaseMessaging: Messaging;
  firebaseToken: string;
  firebaseApp: FirebaseApp;
}

@Injectable({
  providedIn: 'root',
})
export class FirebaseMessage implements IFirebaseMessage, OnDestroy {
  constructor() {
    this.getPermissions();
    this.initialize();
  }

  getPermissions() {
    Notification.requestPermission().then((result:any) => {
      if (result === "granted") {
        navigator.serviceWorker.ready.then((registration:any) => {
          this.registration = registration;
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.messageSub) {
      this.messageSub.apply(this);
    }
    if (this.messageBackSub) {
      this.messageBackSub.apply(this);
    }
  }

  initialize(): void {
    this.firebaseApp = initializeApp({
      apiKey: 'AIzaSyCrE0spBQeu5oWeYRlyWrVo7xZ86EqaRck',
      authDomain: 'ecopsmobile-bf246.firebaseapp.com',
      databaseURL: 'https://ecopsmobile-bf246.firebaseio.com',
      projectId: 'ecopsmobile-bf246',
      storageBucket: 'ecopsmobile-bf246.appspot.com',
      messagingSenderId: '14908799661',
      appId: '1:14908799661:web:0e96a1f8cbbf7431',
    });
    this.firebaseMessaging = getMessaging(this.firebaseApp);
    getToken(this.firebaseMessaging, {
      vapidKey:
        'BBrarO548QIEfor5AruBQXCZ4an4GcpDIjF3O69BVShcNHTv1K6mxeRLjZV6jwk8oNSaauR-FX2je9jRKWF-6_s',
    })
      .then((currentToken) => {
        if (currentToken) {
          // Send the token to your server and update the UI if necessary
          this.firebaseToken = currentToken;
          this.onTokenReceive.emit(this.firebaseToken);
          console.log('Logged!!!');
        } else {
          // Show permission request UI
          const resp =
            'No registration token available. Request permission to generate one.';
          console.log(resp);
          this.onFailReceive.emit(resp);
        }
      })
      .catch((err) => {
        const resp = 'An error occurred while retrieving token. ';
        console.log(resp, err);
        this.onFailReceive.emit(resp);
      });
    this.messageSub = onMessage(
      this.firebaseMessaging,
      (payload: MessagePayload) => {}
    );
    this.messageBackSub = onBackgroundMessage(
      this.firebaseMessaging,
      (payload: MessagePayload) => {
        console.log(
          '[firebase-messaging-sw.js] Received background message ',
          payload
        );
        // Customize notification here
        const notificationTitle = 'Background Message Title';
        const notificationOptions = {
          body: 'Background Message body.',
          icon: '/firebase-logo.png',
        };

        if (this.registration) {
          this.registration.showNotification(
            notificationTitle,
            notificationOptions
          );
        }
      }
    );

  }

  registrationTokens = [
    'YOUR_REGISTRATION_TOKEN_1',
    // ...
    'YOUR_REGISTRATION_TOKEN_n',
  ];

  registration: any;

  messageSub?: Unsubscribe;
  messageBackSub?: Unsubscribe;
  firebaseApp!: FirebaseApp;
  firebaseMessaging!: Messaging;
  firebaseToken!: string;

  onTokenReceive: EventEmitter<string> = new EventEmitter();
  onFailReceive: EventEmitter<string> = new EventEmitter();
}
