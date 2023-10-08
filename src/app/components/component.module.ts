import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from './page-header/page-header.component';

@NgModule({
  declarations: [
    PageHeaderComponent,
  ],
  exports: [
    PageHeaderComponent, // Export the component to make it available to other modules
  ],
  imports: [
    CommonModule
  ]
})
export class ComponentModule { }
