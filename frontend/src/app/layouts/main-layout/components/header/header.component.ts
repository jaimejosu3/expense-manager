import { Component, EventEmitter, Output } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { UserMenuComponent } from '../user-menu/user-menu.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbar,
    MatIcon,
    UserMenuComponent
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() menuToggled = new EventEmitter<void>();
}