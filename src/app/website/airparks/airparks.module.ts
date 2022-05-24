
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AirparksComponent } from './airparks.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { MatCardModule, } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CardsModule, CarouselModule, WavesModule, ButtonsModule, InputsModule, IconsModule } from 'angular-bootstrap-md';
import { MatTabsModule } from '@angular/material';
import { NgxPaginationModule } from 'ngx-pagination';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  imports: [
    InfiniteScrollModule,
    NgxPaginationModule,
    InputsModule,
    IconsModule,
    MatTabsModule,
    ReactiveFormsModule,
    FormsModule,
    CarouselModule,
    WavesModule,
    MatCardModule,
    CommonModule,
    SharedModule,
    CardsModule,
    ButtonsModule,
    RouterModule.forChild([
      { path: '', component: AirparksComponent }
    ])
  ],
  declarations: [AirparksComponent]
})
export class AirparksModule { }