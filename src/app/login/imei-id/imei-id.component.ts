import { Component, OnDestroy, OnInit } from '@angular/core';
import { FirebaseMessage } from '../../services/ifirebase-message';
import { Subscription } from 'rxjs';

export interface StatusToken {
  label: string;
  color: string;
}

@Component({
  selector: 'app-imei-id',
  standalone: true,
  imports: [],
  templateUrl: './imei-id.component.html',
  styleUrl: './imei-id.component.css'
})
export class ImeiIdComponent implements OnInit, OnDestroy {

  currentWakeLock?: WakeLockSentinel;
  buttonLabel: string = 'Start Wake Lock';
  subscriptions: Subscription[] = [];
  imeiToken?: string;
  imeiStatus?: StatusToken;
  IMEI_LOADING: StatusToken = {label: 'Aguardando..', color: 'black'};
  IMEI_ERROR(label:string): StatusToken { return {label: label, color: 'red'}; }
  IMEI_SUCCESS: StatusToken = {label: 'Segue seu IMEI', color: 'black'};

  constructor(private firebaseMessage: FirebaseMessage) { }

  ngOnDestroy(): void {
    for(let i=0; i < this.subscriptions.length; i++)  {
      this.subscriptions[i].unsubscribe();
    }
  }

  ngOnInit(): void {
    this.imeiStatus = this.IMEI_LOADING;
    this.subscriptions.push(this.firebaseMessage
      .onFailReceive.subscribe((resp: string) => {
        this.imeiStatus = this.IMEI_ERROR(resp);
        this.showMessage(resp);
    }));

    this.subscriptions.push(this.firebaseMessage
      .onTokenReceive.subscribe((token: string) => {
        this.imeiStatus = this.IMEI_SUCCESS;
        this.imeiToken = token;
    }));
  }

  showMessage(resp: string) {
    alert(resp);
  }

  toggleWakeLock() {
    if(!navigator.wakeLock) {

    } else if(this.currentWakeLock && !this.currentWakeLock.released) {
      this.releaseScreen();
    } else {
      this.lockScreen();
    }
  }

  async lockScreen() {
    try {
     this.currentWakeLock = await navigator.wakeLock.request();
     this.buttonLabel = 'Release Wake Lock';
    } catch(err) {
      alert(err);
    }
  }

  async releaseScreen() {
    this.currentWakeLock?.release();
    this.buttonLabel = 'Start Wake Lock';
    alert('Wake Lock released');
  }
}
