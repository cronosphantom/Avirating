import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerPostComponent } from './customer-post.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CarouselModule,WavesModule, ButtonsModule, InputsModule, IconsModule } from 'angular-bootstrap-md';
import { SharedModule } from '../shared/shared.module';
import { NgImageSliderModule } from 'ng-image-slider';
@NgModule({
  declarations: [CustomerPostComponent],
  imports: [
    WavesModule,
    ButtonsModule,
    InputsModule,
    IconsModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    SharedModule,
    CarouselModule,
    RouterModule.forChild([
      { path: '', component: CustomerPostComponent }
    ]),
    NgImageSliderModule,
  ]
})
export class CustomerPostModule { }
