import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FooterModule } from '@coreui/angular';
import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServicesService, Credential } from '../../services/auth-services.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatInputModule, MatIconModule, MatFormFieldModule, MatSnackBarModule, FormsModule, ReactiveFormsModule, FooterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  hide: boolean = true;
  private authService = inject(AuthServicesService);
  toastSvc = inject(ToastrService)
  private _router = inject(Router);
  private _snackbar = inject(MatSnackBar);
  errorLogin = ''
  formLogin = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  async login(): Promise<void> {
    if (this.formLogin.invalid) return;
    const credential: Credential = {
      email: this.formLogin.value.correo || '',
      password: this.formLogin.value.password || '',
    };
    try {
      await this.authService.login(credential);
      //const snackBarRef = this.openSnackBar();
      //snackBarRef.afterDismissed().subscribe(() => {
      //});
      this.toastSvc.success('Se ingreso correctamente', 'Login Correcto')
      this._router.navigateByUrl('/auth/elecciones');
    } catch (error) {
      this.errorLogin = 'Usuario No valido.'
      console.log(error);
      this.toastSvc.success('no se pudo ingresar correctamente', 'Login Incorrecto')
    }
  }

  openSnackBar() {
    return this._snackbar.open('Login Correcto', 'Close', {
      duration: 1500,
      verticalPosition: 'top',
      horizontalPosition: 'end',
    });
  }
}
