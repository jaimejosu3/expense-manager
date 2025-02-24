import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [MatIcon, MatMenu, MatMenuModule, MatMenuItem],
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent {
  constructor(private authService: AuthService, private router: Router) { }
  menuItems = [
    { label: 'Cerrar Sesión', icon: 'exit_to_app', action: () => this.handleLogout() }
  ];
  handleLogout(): void {
    this.authService.logout();
  }
}
