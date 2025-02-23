import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatList, MatListItem } from '@angular/material/list';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavContainer,
    MatSidenavContent,
    MatSidenav,
    SidenavComponent,
    HeaderComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  drawerOpened = true;

  toggleDrawer(opened: boolean) {
    this.drawerOpened = opened;
  }
}