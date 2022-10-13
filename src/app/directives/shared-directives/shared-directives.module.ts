import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StickySegmentDirective } from '../sticky-segment.directive';



@NgModule({
  declarations: [StickySegmentDirective],
  exports: [StickySegmentDirective],
  imports: [
    CommonModule
  ]
})
export class SharedDirectivesModule { }
