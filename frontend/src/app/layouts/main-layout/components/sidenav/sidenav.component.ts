import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem, MatListModule } from '@angular/material/list';
import { NavItem } from '../../models/nav-item.model';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [MatListModule, MatListItem, MatIcon, RouterLink, RouterLinkActive],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Gastos', icon: 'receipt', route: '/expenses' },
    { label: 'Categorías', icon: 'category', route: '/categories' },
    { label: 'Presupuestos', icon: 'account_balance_wallet', route: '/budgets' }
  ];
}