import { NgModule } from '@angular/core'
import { PostReportComponent } from './post-report.component'
import { AdminSharedModule } from '../admin-shared/admin-shared.module'
import { SharedModule } from 'src/app/website/shared/shared.module'
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { TabsModule, TabsetConfig } from 'ngx-bootstrap/tabs'
import {  WavesModule, ButtonsModule, InputsModule, IconsModule } from 'angular-bootstrap-md';
@NgModule({
  imports: [
    AdminSharedModule,
    SharedModule,
    FormsModule,
    TabsModule,
    ButtonsModule,
    WavesModule,
    InputsModule, IconsModule,
    RouterModule.forChild([
      { path: '', component: PostReportComponent }
    ])
  ],
  providers: [TabsetConfig],
  declarations: [PostReportComponent],

})
export class PostReportModule { }
