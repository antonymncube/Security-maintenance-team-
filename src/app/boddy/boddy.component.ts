import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-boddy',
  //standalone: true,
  //imports: [CommonModule],
  templateUrl: './boddy.component.html',
  styleUrls: ['./boddy.component.scss'],
})
export class BoddyComponent {
  @Input() collapsed = false;
  @Input() screenWidth = 0;

  getBodyClass(): string{
    let styleClass = '';
    if(this.collapsed && this.screenWidth > 768){
      styleClass = 'body-trimmed'
    }else if(this.collapsed && this.screenWidth <= 768 && this.screenWidth > 0){
      styleClass = 'body-md-screen'
    }
    return styleClass;
  }
}
