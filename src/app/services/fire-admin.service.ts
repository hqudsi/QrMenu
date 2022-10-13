import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, where, addDoc, doc, docData, setDoc, collectionGroup, getDocs, updateDoc, orderBy, limit, startAfter, deleteDoc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FireAuthService } from './fire-auth.service';
import { Functions, httpsCallable } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class FireAdminService {

  // cafeUser: any;

  constructor(
    private firestore: Firestore,
    private fireAuth: FireAuthService,
    private functions: Functions
  ) { }

  getCafeUser(): Observable<any> {
    // const cafeUserRef = collection(this.firestore, 'cafe_users');
    // const cafeUserQuery = query(cafeUserRef, where("user_id", "==", this.fireAuth.userData.uid));
    const cafeUserRef = doc(this.firestore, `users/${this.fireAuth.userData.uid}`);
    return docData(cafeUserRef, { idField: 'id' }) as Observable<any>;
  }

  getMyItems(): Observable<any> {
    const itemsRef = collection(this.firestore, 'items');
    const itemsQuery = query(itemsRef, where("cafe_id", "==", this.fireAuth.cafeUser.cafe_id));
    return collectionData(itemsQuery, { idField: 'id' }) as Observable<any>;
  }

  getMyCategories(): Observable<any> {
    const categoriesRef = collection(this.firestore, 'categories');
    const categoriesQuery = query(categoriesRef, where("cafe_id", "==", this.fireAuth.cafeUser.cafe_id));
    return collectionData(categoriesQuery, { idField: 'id' }) as Observable<any>;
  }

  getMyCategoriesPromise() {
    const categoriesRef = collection(this.firestore, 'categories');
    const categoriesQuery = query(
                            categoriesRef,
                            where("cafe_id", "==", this.fireAuth.cafeUser.cafe_id),
                            orderBy("order"),
                            orderBy("create_at"));
    return getDocs(categoriesQuery);
  }

  getMyItemsOfCatPromise(category_id: string) {
    const itemsQuery = query(collection(this.firestore, 'items'),
                    where("categories", "array-contains", category_id),
                    where("cafe_id", "==", this.fireAuth.cafeUser.cafe_id),
                    where("multi_category", "==", false),
                    orderBy("order"),
                    orderBy("create_at")
                    );
    return getDocs(itemsQuery);
  }

  getReferenceCategories() {
    const categoriesRef = collection(this.firestore, 'categories');
    const categoriesQuery = query(
                            categoriesRef,
                            where("cafe_id", "==", this.fireAuth.cafeUser.cafe_id),
                            orderBy("ref_category"));
    return getDocs(categoriesQuery);
  }

  getReferenceItems() {
    const itemsRef = collection(this.firestore, 'items');
    const itemsQuery = query(
                            itemsRef,
                            where("cafe_id", "==", this.fireAuth.cafeUser.cafe_id),
                            orderBy("ref_item"));
    return getDocs(itemsQuery);
  }

  getSelectedCategories(refCategories) {
    const categoriesRef = collection(this.firestore, 'categories');
    const categoriesQuery = query(
                            categoriesRef,
                            where("cafe_id", "==", "1kjKKLLxOV3Y8ADLVMyY"),
                            where("id", "not-in", refCategories),
                            orderBy("id"));
    return getDocs(categoriesQuery);
  }

  getAllSelectedCategories() {
    const categoriesRef = collection(this.firestore, 'categories');
    const categoriesQuery = query(
                            categoriesRef,
                            where("cafe_id", "==", "1kjKKLLxOV3Y8ADLVMyY"),
                            orderBy("order"),
                            orderBy("create_at")
                            );
    return getDocs(categoriesQuery);
  }

  getSelectedItems(refItems) {
    const itemsRef = collection(this.firestore, 'items');
    const itemsQuery = query(
                            itemsRef,
                            where("cafe_id", "==", "1kjKKLLxOV3Y8ADLVMyY"),
                            where("id", "not-in", refItems),
                            orderBy("id")
                            );
    return getDocs(itemsQuery);
  }

  getAllSelectedItems() {
    const itemsRef = collection(this.firestore, 'items');
    const itemsQuery = query(
                            itemsRef,
                            where("cafe_id", "==", "1kjKKLLxOV3Y8ADLVMyY"),
                            orderBy("order"),
                            orderBy("create_at")
                            );
    return getDocs(itemsQuery);
  }

  addItem(item) {
    const notesRef = collection(this.firestore, 'items');
    return addDoc(notesRef, item);
  }

  deleteItem(itemId) {
    const docRef = doc(this.firestore, "items", itemId);
    return deleteDoc(docRef);
  }

  addCategory(category) {
    const categoryRef = collection(this.firestore, 'categories');
    return addDoc(categoryRef, category);
  }

  async updateCafe(cafeId, data) {
    const docRef = doc(this.firestore, "cafes", cafeId);
    await setDoc(docRef, data, { merge: true });
  }

  async updateCategory(categoryId, data) {
    const docRef = doc(this.firestore, "categories", categoryId);
    await setDoc(docRef, data, { merge: true });
  }

  async updateItem(itemId, data) {
    const docRef = doc(this.firestore, "items", itemId);
    await setDoc(docRef, data, { merge: true });
  }

  updateActive(itemId, active) {
    const docRef = doc(this.firestore, "items", itemId);
    return updateDoc(docRef, {active: active});
  }

  updateShow(itemId, show) {
    const docRef = doc(this.firestore, "items", itemId);
    return updateDoc(docRef, {show: show});
  }

  getItem(itemId) {
    const docRef = doc(this.firestore, "items", itemId);
    return getDoc(docRef);
  }

  getCategory(categoryId) {
    const docRef = doc(this.firestore, "categories", categoryId);
    return getDoc(docRef);
  }


  getMyItemsPagination(limitNumber: number) {
    const first = query(collection(this.firestore, 'items'),
                  where("cafe_id", "==", this.fireAuth.cafeUser.cafe_id),
                  orderBy("create_at", "desc"),
                  limit(limitNumber));
    return getDocs(first);
  }

  getNextMyItemsPagination(limitNumber: number, startAfterDoc: any) {
    const next = query(collection(this.firestore, 'items'),
                  where("cafe_id", "==", this.fireAuth.cafeUser.cafe_id),
                  orderBy("create_at", "desc"),
                  startAfter(startAfterDoc),
                  limit(limitNumber));
    return getDocs(next);
  }

  getMyItemsOfCatPagination(limitNumber: number, category_id: string) {
    const first = query(collection(this.firestore, 'items'),
                    where("categories", "array-contains", category_id),
                    where("cafe_id", "==", this.fireAuth.cafeUser.cafe_id),
                    orderBy("create_at", "desc"),
                    limit(limitNumber));
    return getDocs(first);
  }

  getNextMyItemsOfCatPagination(limitNumber: number, startAfterDoc: any, category_id: string) {
    const next = query(collection(this.firestore, 'items'),
                  where("categories", "array-contains", category_id),
                  where("cafe_id", "==", this.fireAuth.cafeUser.cafe_id),
                  orderBy("create_at", "desc"),
                  startAfter(startAfterDoc),
                  limit(limitNumber));
    return getDocs(next);
  }

  getAccountRequest(): Observable<any> {
    const requestRef = collection(this.firestore, 'register_request');
    const requestQuery = query(requestRef, where("status", "==", "new"), orderBy('created_at'));
    return collectionData(requestQuery, { idField: 'id' }) as Observable<any>;
  }

  getUsersAccounts(): Observable<any> {
    const requestRef = collection(this.firestore, 'users');
    const requestQuery = query(requestRef, where("type", "==", 2));
    return collectionData(requestQuery, { idField: 'id' }) as Observable<any>;
  }

  rejectRequest(requestId) {
    const docRef = doc(this.firestore, "register_request", requestId);
    return updateDoc(docRef, {status: "rejected"});
  }

  acceptRequest(requestId) {
    const docRef = doc(this.firestore, "register_request", requestId);
    return updateDoc(docRef, {status: "accepted"});
    // var randomPassword = Math.random().toString(36).slice(-8);
    // console.log(randomPassword);
    // console.log(request);
    // const helloWorld = httpsCallable(this.functions, 'helloWorld');
    // helloWorld().then((result) => {
      // console.log('complete call function: ', result);
    // }).catch((error) => {
      // console.log('error call function: ', error);
      // Getting the Error details.
      // const code = error.code;
      // const message = error.message;
      // const details = error.details;
      // ...
    // });
    // createUserWithEmailAndPassword(this.auth, request.email, randomPassword)
    // .then(res => {
    //   console.log(res);
    // })
    // .catch(error => {
    //   console.log('error: ', error);
    // });
    // const docRef = doc(this.firestore, "register_request", requestId);
    // return updateDoc(docRef, {status: "rejected"});
  }

  async testAddCity() {
    // ============= add cities
    // const citiesRef = collection(this.firestore, "cities");

    // await setDoc(doc(citiesRef, "SF"), {
    //   name: "San Francisco", state: "CA", country: "USA",
    //   capital: false, population: 860000,
    //   regions: ["west_coast", "norcal"],
    //   testobject: {
    //     name: 'hani',
    //     age: 32
    //   }
    // });
    // await setDoc(doc(citiesRef, "LA"), {
    //   name: "Los Angeles", state: "CA", country: "USA",
    //   capital: false, population: 3900000,
    //   regions: ["west_coast", "socal"]
    // });
    // await setDoc(doc(citiesRef, "DC"), {
    //   name: "Washington, D.C.", state: null, country: "USA",
    //   capital: true, population: 680000,
    //   regions: ["east_coast"]
    // });
    // await setDoc(doc(citiesRef, "TOK"), {
    //   name: "Tokyo", state: null, country: "Japan",
    //   capital: true, population: 9000000,
    //   regions: ["kanto", "honshu"]
    // });
    // await setDoc(doc(citiesRef, "BJ"), {
    //   name: "Beijing", state: null, country: "China",
    //   capital: true, population: 21500000,
    //   regions: ["jingjinji", "hebei"]
    // });


    // =============

    // await setDoc(doc(citiesRef, 'SF/landmarks/SFL'), {
    //   name: 'Golden Gate Bridge',
    //   type: 'bridge'
    // });


    // const collectionDocRef = collection(this.firestore, `cities/SF/landmarks`);
    // await setDoc(doc(collectionDocRef, `${new Date().getTime()}`), {
    //   name: 'Golden Gate Bridge',
    //   type: 'bridge'
    // });

    // const docRef = doc(this.firestore, `cities/SF`);
    // await setDoc(doc(docRef, `landmarks/${new Date().getTime()}`), {
    //   name: 'Golden Gate Bridge',
    //   type: 'bridge'
    // });

    // await Promise.all([
    //   setDoc(doc(citiesRef, 'SF/landmarks' + '/' + new Date().getTime()), {
    //     name: 'Golden Gate Bridge',
    //     type: 'bridge'
    //   }),
    //   setDoc(doc(citiesRef, 'SF/landmarks' + '/' + new Date().getTime()), {
    //     name: 'Legion of Honor',
    //     type: 'museum'
    //   }),
    //   setDoc(doc(citiesRef, 'LA/landmarks' + '/' + new Date().getTime()), {
    //     name: 'Griffith Park',
    //     type: 'park'
    //   }),
    //   setDoc(doc(citiesRef, 'LA/landmarks' + '/' + new Date().getTime()), {
    //     name: 'The Getty',
    //     type: 'museum'
    //   }),
    //   setDoc(doc(citiesRef, 'DC/landmarks' + '/' + new Date().getTime()), {
    //     name: 'Lincoln Memorial',
    //     type: 'memorial'
    //   }),
    //   setDoc(doc(citiesRef, 'DC/landmarks' + '/' + new Date().getTime()), {
    //     name: 'National Air and Space Museum',
    //     type: 'museum'
    //   }),
    //   setDoc(doc(citiesRef, 'TOK/landmarks' + '/' + new Date().getTime()), {
    //     name: 'Ueno Park',
    //     type: 'park'
    //   }),
    //   setDoc(doc(citiesRef, 'TOK/landmarks' + '/' + new Date().getTime()), {
    //     name: 'National Museum of Nature and Science',
    //     type: 'museum'
    //   }),
    //   setDoc(doc(citiesRef, 'BJ/landmarks' + '/' + new Date().getTime()), {
    //     name: 'Jingshan Park',
    //     type: 'park'
    //   }),
    //   setDoc(doc(citiesRef, 'BJ/landmarks' + '/' + new Date().getTime()), {
    //     name: 'Beijing Ancient Observatory',
    //     type: 'museum'
    //   })
    // ]);


    // const museums = query(collectionGroup(this.firestore, 'landmarks'));
    // const querySnapshot = await getDocs(museums);
    // querySnapshot.forEach((doc) => {
    //     console.log(doc.id, ' => ', doc.data());
    // });

    const ref = collection(this.firestore, 'cities/BJ/landmarks');
    await addDoc(ref, {
      name: 'Beijing Ancient Observatory',
      type: 'museum'
    });

    const landmarksRef = collection(this.firestore, 'cities/BJ/landmarks');
    const categoriesQuery = query(landmarksRef);
    const querySnapshot2 = await getDocs(categoriesQuery);
    querySnapshot2.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data());
    });

  }
}
