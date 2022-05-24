
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MyAirportsComponent } from './my-airports.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { MatCardModule, } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CardsModule,  WavesModule, ButtonsModule, IconsModule } from 'angular-bootstrap-md';




@NgModule({
  
  imports: [
    IconsModule,
    ReactiveFormsModule,
    FormsModule,
    WavesModule,
    MatCardModule,
    CommonModule,
    SharedModule,
    CardsModule,
    ButtonsModule,
    RouterModule.forChild([
      { path: '', component: MyAirportsComponent }
    ]),
    CommonModule,
  ],
  declarations: [MyAirportsComponent],
})
export class MyAirportsModule { }
