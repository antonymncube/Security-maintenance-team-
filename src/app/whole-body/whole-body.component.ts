import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-whole-body',
  //standalone: true,
  //imports: [CommonModule],
  templateUrl: './whole-body.component.html',
  styleUrls: ['./whole-body.component.scss']
})
export class WholeBodyComponent {
  @Input() collapsed = false;
  @Input() screenwidth = 0;

  isSideNavCollapsed = false;
  screenWidth = 0;

  getBodyClass(): string{
    let styleClass = '';
    if(this.collapsed && this.screenwidth > 768){
      styleClass = 'body-trimmed'
    }else if(this.collapsed && this.screenwidth <= 768 && this.screenwidth > 0){
      styleClass = 'body-md-screen'
    }
    return styleClass;
  }
}
