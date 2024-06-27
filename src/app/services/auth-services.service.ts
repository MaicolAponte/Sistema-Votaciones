import { Injectable, inject } from '@angular/core';
import { Auth, UserCredential, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, user } from '@angular/fire/auth';
import { Firestore, collection } from '@angular/fire/firestore';

export interface Credential {
  email: string,
  password: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthServicesService {
  private auth: Auth = inject(Auth);
  correo: any = ''
  userData: any;
  readonly authState$ = authState(this.auth);
  

  login(credential: Credential): Promise<UserCredential>{
    return signInWithEmailAndPassword(this.auth, credential.email, credential.password);
  }

  logout(): Promise<void>{
    return this.auth.signOut();
  }

  
}
