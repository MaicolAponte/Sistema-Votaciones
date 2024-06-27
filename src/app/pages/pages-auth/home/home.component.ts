import { Component, OnInit, inject} from '@angular/core';
import { SidenavComponent } from '../../components/sidenav/sidenav.component';
import { BodyComponent } from '../body/body.component';
import { SideNavToggle } from '../../../interfaces/interfaces';
import { FirebaseService } from '../../../services/firebase.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidenavComponent, BodyComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  _fireSrv = inject(FirebaseService)
  title = 'Proyect-Base';
  isSideNavCollapsed = false;
  screenWidth = 0;

  onToggleSideNav(data: SideNavToggle) {
    this.screenWidth = data.screenWidth
    this.isSideNavCollapsed = data.collapsed
  }

  ngOnInit(): void {
      this._fireSrv.getOptions().subscribe( (res) => {
       this._fireSrv.Options = res[0].listaElecciones
       //console.log(this._fireSrv.Options)
      })
  }

}
