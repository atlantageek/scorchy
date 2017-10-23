import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {SystemscanChartComponent } from './systemscan-chart/systemscan-chart.component'

@NgModule({
  declarations: [
    AppComponent,
    SystemscanChartComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
