import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [MatIcon, MatMenu, MatMenuModule, MatMenuItem],
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent {
  menuItems = [
    { label: 'Mi Perfil', icon: 'person', action: () => this.handleProfile() },
    { label: 'Configuración', icon: 'settings', action: () => this.handleSettings() },
    { label: 'Cerrar Sesión', icon: 'exit_to_app', action: () => this.handleLogout() }
  ];

  handleProfile(): void {
    console.log('Navigate to profile');
  }

  handleSettings(): void {
    console.log('Navigate to settings');
  }

  handleLogout(): void {
    console.log('Logout user');
  }
}
