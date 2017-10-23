import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  channels = [];
  currIndex = 0;
  data=[]
  constructor() {
    for (var i=100;i< 190;i++) {
      this.channels.push('' + i)
    }

  }
  ngAfterViewInit():void {
    setInterval(() => {
      this.currIndex = this.currIndex % this.channels.length;
      for (var i=0;i<6;i++) {
        if (i % 3 == 0) {
          let videoLevel = Math.random() * -30;
          this.data[i] ={number:this.channels[this.currIndex], digital: false, audioLevel: videoLevel + Math.random() * -8, videoLevel: videoLevel, mer:40, locked: true}
        }
        else {
          this.data[i] ={number:this.channels[this.currIndex], digital: true, level:Math.random() * -30, mer:40, locked: true}
        }
        this.currIndex = (this.currIndex + 1) % this.channels.length;
      }
      console.log("Interval");
      console.log(this.data);
      this.data = this.data.splice(0);
    },4000)

  }
}
