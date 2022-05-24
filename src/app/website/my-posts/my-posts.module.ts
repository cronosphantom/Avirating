import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyPostsComponent } from './my-posts.component';
import { ImageCropperModule } from 'ngx-image-cropper'
import { ModalModule } from 'ngx-bootstrap/modal'
import { MatFormFieldModule, MatSelectModule } from '@angular/material';
import { NgImageSliderModule } from 'ng-image-slider';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { MatCardModule, } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CardsModule, CarouselModule, WavesModule, ButtonsModule, InputsModule, IconsModule } from 'angular-bootstrap-md';
import { MatTabsModule } from '@angular/material';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CarouselModule,
    WavesModule,
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonsModule,
    InputsModule,
    IconsModule,
    NgxPaginationModule,
    MatCardModule,
    MatTabsModule,
    CardsModule,
    RouterModule.forChild([
      { path: '', component: MyPostsComponent }
    ]),
    ImageCropperModule,
    MatFormFieldModule,
    ModalModule.forRoot(),
    MatSelectModule,
    NgImageSliderModule,
    
  ],
  declarations: [MyPostsComponent]
})
export class MyPostsModule { }
