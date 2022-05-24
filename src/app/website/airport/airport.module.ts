import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AirportComponent } from './airport.component';
import { RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal'
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CarouselModule,WavesModule, ButtonsModule, InputsModule, IconsModule } from 'angular-bootstrap-md';
import { MatTabsModule } from '@angular/material';

import { ImageCropperModule } from 'ngx-image-cropper'
import { MatFormFieldModule, MatSelectModule } from '@angular/material';
import { NgImageSliderModule } from 'ng-image-slider';
import { MatCardModule, } from '@angular/material';

@NgModule({

  imports: [
    WavesModule,
    CarouselModule,
    ButtonsModule,
    InputsModule,
    IconsModule,
    ReactiveFormsModule,
    FormsModule,
    MatTabsModule,
    SharedModule,
    ImageCropperModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    ModalModule.forRoot(),
    RouterModule.forChild([
      { path: '', component: AirportComponent }
    ]),
    CommonModule,
    NgImageSliderModule,
  ],

  declarations: [AirportComponent]
})
export class AirportModule { }
