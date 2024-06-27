import { Component, EventEmitter, HostListener, OnInit, Output, inject } from '@angular/core';
import { navbarData } from './navData';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { SideNavToggle } from '../../../interfaces/interfaces';
import { AuthServicesService } from '../../../services/auth-services.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterLink, NgIf, NgClass, RouterLinkActive],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent implements OnInit {
  private authService = inject(AuthServicesService)
  private _snackbar = inject(MatSnackBar)
  private _router = inject(Router)
  
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false
      this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth})
    }
  }
  collapsed = false
  screenWidth = 0
  navData = navbarData

  toggleCollapsed() {
    this.collapsed = !this.collapsed
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth})
  }

  closeSidenav() {  
    this.collapsed = false
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth})
  }

  async exit(): Promise<void>{
    try {
      await this.authService.logout();
      const snackBarRef = this.openSnackBar()
      snackBarRef.afterDismissed().subscribe(() =>{
      this._router.navigateByUrl('/home/login');
      window.location.reload()
    })
    } catch (error) {
      console.log(error);
    }
  }

  openSnackBar() {
    return this._snackbar.open('Saliendo..', 'Close', {
      duration: 1000,
      verticalPosition: 'top',
      horizontalPosition: 'end',  
    });
  }
  
    panelOpenState = false;
    flecha = false
    opened = false
    page = 'Reportes'
    reciveOpened($event: boolean){
      this.opened = $event
    }

  ngOnInit(): void {
      this.screenWidth = window.innerWidth
  }
}
