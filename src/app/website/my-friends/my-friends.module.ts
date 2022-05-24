import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { MatCardModule, } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CardsModule, CarouselModule, WavesModule, ButtonsModule, InputsModule, IconsModule } from 'angular-bootstrap-md';
import { MyFriendsComponent } from './my-friends.component';



@NgModule({

  imports: [
    CommonModule,
    SharedModule,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonsModule,
    InputsModule,
    IconsModule,
    WavesModule,
    CarouselModule,
    CardsModule,
    RouterModule.forChild([
      { path: '', component: MyFriendsComponent }
    ]),
    
  ],
  declarations: [MyFriendsComponent],
})
export class MyFriendsModule { }
