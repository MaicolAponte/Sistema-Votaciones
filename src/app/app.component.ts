import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterModule } from '@coreui/angular';
import { AuthServicesService } from './services/auth-services.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  _authSrv = inject(AuthServicesService)

  ngOnInit(): void {
      console.log('inicia')
    this._authSrv.authState$.subscribe( (user) => {
      this._authSrv.correo = user?.email
      //console.log('obteniendo correo')
    })
    //res.unsubscribe()
  }
}
