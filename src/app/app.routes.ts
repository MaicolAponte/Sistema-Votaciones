import { Routes } from '@angular/router';

import { authGuard, publicGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/pages-auth/home/home.component';
import { UsuariosComponent } from './pages/pages-auth/pages/usuarios/usuarios.component';
import { EleccionesComponent } from './pages/pages-auth/pages/elecciones/elecciones.component';
import { CandidatosComponent } from './pages/pages-auth/pages/candidatos/candidatos.component';
import { ResultadosComponent } from './pages/pages-auth/pages/resultados/resultados.component';
import { ReportesComponent } from './pages/pages-auth/pages/reportes/reportes.component';
import { VotacionComponent } from './pages/votacion/votacion.component';

export const routes: Routes = [
    {path: 'auth', canActivate: [authGuard], component: HomeComponent, children: [
        {path: 'usuarios', component: UsuariosComponent},
        {path: 'elecciones', component: EleccionesComponent},
        {path: 'candidatos', component: CandidatosComponent},
        {path: 'resultados', component: ResultadosComponent},
        {path: 'reportes', component: ReportesComponent}
    ]},
    { path: 'home', canActivate: [publicGuard], children: [
        {path: 'login', component: LoginComponent},
        {path: 'votacion/:id', component: VotacionComponent},
        { path: '**', redirectTo: '/'}
    ]},
    { path: '**', redirectTo: 'home/login'}
    
];
