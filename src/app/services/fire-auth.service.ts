import { Injectable } from '@angular/core';
import { Auth, authState, reauthenticateWithCredential, signInWithEmailAndPassword, signOut, AuthCredential, EmailAuthProvider, updatePassword } from '@angular/fire/auth';
import { doc, docData, Firestore, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { BehaviorSubject } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

const USER_DATA_KEY = '4x8a9yns';
const CAFE_USER_KEY = 'vq683zye';

@Injectable({
  providedIn: 'root'
})
export class FireAuthService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  userData: any;
  cafeUser: any;

  constructor(
    private fireAuth: Auth,
    private router: Router,
    private firestore: Firestore
  ) {
    this.loadUser();
  }

  async loadUser() {
    const userString = await Storage.get({ key: USER_DATA_KEY });
    if (userString && userString.value) {
      this.userData = JSON.parse(userString.value);
      const cafeUserString = await Storage.get({ key: CAFE_USER_KEY });
      this.cafeUser = JSON.parse(cafeUserString.value);
      this.isAuthenticated.next(true);
      await authState(this.fireAuth).pipe(
        filter(val => val !== null), // Filter out initial Behaviour subject value
        take(1), // Otherwise the Observable doesn't complete!
        map(user => {
          if (user) {
            Storage.set({key: USER_DATA_KEY, value: JSON.stringify(user)});
            this.userData = user;
            const cafeUserRef = doc(this.firestore, `users/${this.userData.uid}`);
            docData(cafeUserRef, { idField: 'id' }).subscribe(res => {
              this.cafeUser =  res;
              Storage.set({key: CAFE_USER_KEY, value: JSON.stringify(this.cafeUser)});
            });
          }
        })
      );
    } else {
      this.isAuthenticated.next(false);
    }
  }

  signIn(credentials): Promise<any> {
    return signInWithEmailAndPassword(this.fireAuth, credentials.email, credentials.password)
    .then(async (userCredential) => {
      // Signed in
      this.userData = userCredential.user;
      Storage.set({key: USER_DATA_KEY, value: JSON.stringify(this.userData)});
      this.isAuthenticated.next(true);
      const cafeUserRef = doc(this.firestore, `users/${this.userData.uid}`);
      const cafeUserData = await getDoc(cafeUserRef);
      this.cafeUser =  {...cafeUserData.data(), ...{id: cafeUserData.id}};
      Storage.set({key: CAFE_USER_KEY, value: JSON.stringify(this.cafeUser)});
      return this.userData;
    })
    .catch((error) => {
      // return false;
      throw new Error(error);
    });
  }

  logout() {
    signOut(this.fireAuth).then(() => {
      // Sign-out successful.
      this.userData = null;
      Storage.remove({key: USER_DATA_KEY});
      Storage.remove({key: CAFE_USER_KEY});
      this.isAuthenticated.next(false);
      this.router.navigateByUrl('/', { replaceUrl: true });
    }).catch((error) => {
      // An error happened.
      console.log('error logout: ', error);
    });
  }

  changePassword(oldPassword, newPassword): Promise<any> {
    let creadintal: AuthCredential = EmailAuthProvider.credential(this.userData.email, oldPassword);
    return reauthenticateWithCredential(this.fireAuth.currentUser, creadintal)
    .then(res => {
      updatePassword(this.fireAuth.currentUser, newPassword).then(() => {
        return true;
      }).catch((error) => {
        console.log('change password error: ', error);
        throw new Error(error.code);
      });
    })
    .catch(error => {
      console.log('re-auth error.');
      throw new Error(error.code);
    });
  }
}
