import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupPostComponent } from './group-post.component';
import { SharedModule } from '../shared/shared.module';
import { ImageCropperModule } from 'ngx-image-cropper'
import { ModalModule } from 'ngx-bootstrap/modal'
import { RouterModule } from '@angular/router';
import { MatFormFieldModule, MatSelectModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgImageSliderModule } from 'ng-image-slider';
import { CarouselModule, WavesModule, ButtonsModule } from 'angular-bootstrap-md';
@NgModule({
  imports: [
    CarouselModule,
    WavesModule,
    NgSelect2Module,
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonsModule,
    RouterModule.forChild([
      { path: '', component: GroupPostComponent }
    ]),
    ImageCropperModule,
    MatFormFieldModule,
    ModalModule.forRoot(),
    MatSelectModule,
    NgImageSliderModule,
  ],
  declarations: [GroupPostComponent]
})
export class GroupPostModule { }