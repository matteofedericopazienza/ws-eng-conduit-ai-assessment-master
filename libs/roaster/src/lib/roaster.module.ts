import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoasterComponent } from './roaster';


@NgModule({
  imports: [CommonModule, RoasterComponent, NgModule],
  declarations: [
    RoasterComponent
  ],
})
export class RoasterModule { }
