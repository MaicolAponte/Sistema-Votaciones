import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServicesService } from '../services/auth-services.service';
import { map } from "rxjs";

export const  routerInjection = () => inject(Router);

export const authStateObs$ = () => inject(AuthServicesService).authState$;

export const  authGuard: CanActivateFn = () => {
    const router = routerInjection();
    return authStateObs$().pipe(
        map((user) => {
            if(!user) {
                router.navigateByUrl('home/login');
                return false;
            }
            return true;
        })
    );
};

export const publicGuard: CanActivateFn = () => {
    const router =  routerInjection();
    
    return authStateObs$().pipe(
        map((user) => {
            if(user) {
                router.navigateByUrl('auth/elecciones');
                return false;
            }
            return true;
        })
    );
}
 