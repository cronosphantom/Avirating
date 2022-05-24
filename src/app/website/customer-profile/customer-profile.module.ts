import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/website/shared/shared.module'
import { CustomerProfileComponent } from './customer-profile.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TabsModule, TabsetConfig } from 'ngx-bootstrap/tabs'
import { CardsModule, WavesModule, ButtonsModule, InputsModule, IconsModule } from 'angular-bootstrap-md';
import { LightboxModule } from 'ngx-lightbox';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatCardModule, } from '@angular/material';

@NgModule({


  imports: [
    WavesModule,
    ButtonsModule,
    InputsModule,
    IconsModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    TabsModule,
    CardsModule,
    LightboxModule,
    MatCardModule,
    ModalModule.forRoot(),
    SharedModule,
    RouterModule.forChild([
      { path: '', component: CustomerProfileComponent }
    ]),
  ],
  providers: [TabsetConfig],
  declarations: [CustomerProfileComponent],
  bootstrap: [CustomerProfileComponent],
 })
export class CustomerProfileModule { }
