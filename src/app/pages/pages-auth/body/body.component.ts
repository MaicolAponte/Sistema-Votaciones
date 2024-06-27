import { NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterModule } from '@coreui/angular';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [RouterOutlet, NgClass, NgIf, FooterModule],
  templateUrl: './body.component.html',
  styleUrl: './body.component.css'
})
export class BodyComponent {

  @Input() collapsed = false
  @Input()  screenWidth = 0


  getBodyClass(): string {
    let styleClass = ''
    if (this.collapsed && this.screenWidth > 768) {
      styleClass = 'body-trimmed';
    } else {
      styleClass = 'body-md-screen'
    }
    return styleClass
  }

}
