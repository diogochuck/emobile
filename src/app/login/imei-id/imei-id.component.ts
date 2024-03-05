import { Component } from '@angular/core';

@Component({
  selector: 'app-imei-id',
  standalone: true,
  imports: [],
  templateUrl: './imei-id.component.html',
  styleUrl: './imei-id.component.css'
})
export class ImeiIdComponent {

  currentWakeLock?: WakeLockSentinel;
  buttonLabel: string = 'Start Wake Lock';

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
