import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, docData, endAt, Firestore, getDocs, limit, orderBy, query, startAfter, startAt, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FireServiceService {

  constructor(private firestore: Firestore) { }

  getCafeById(id): Observable<any> {
    const cafeDocRef = doc(this.firestore, `cafes/${id}`);
    return docData(cafeDocRef, { idField: 'id' }) as Observable<any>;
  }

  getCategoriesOfCafe(id): Observable<any> {
    const categoriesRef = collection(this.firestore, 'categories');
    const categoriesQuery = query(categoriesRef, where("cafe_id", "==", id));
    return collectionData(categoriesQuery, { idField: 'id'}) as Observable<any>;
  }

  getCafeCategories(cafe_id, type_id): Observable<any> {
    const categoriesRef = collection(this.firestore, 'categories');
    const categoriesQuery = query(categoriesRef,
                              where("cafe_id", "==", cafe_id),
                              where("type_id", "==", type_id),
                              orderBy("order"),
                              orderBy("create_at")
                            );
    return collectionData(categoriesQuery, { idField: 'id'}) as Observable<any>;
  }

  getItemsOfCategory(category_id, cafe_id): Observable<any> {
    const itemsRef = collection(this.firestore, 'items');
    const itemsQuery = query(itemsRef,
                      where("categories", "array-contains", category_id),
                      where("cafe_id", "==", cafe_id),
                      where("show", "==", true),
                      orderBy("order"),
                      orderBy("create_at"));
    return collectionData(itemsQuery, { idField: 'id'}) as Observable<any>;
  }

  getItemsPagination(limitNumber: number, searchText: string, cafe_id) {
    const first = query(collection(this.firestore, 'items'),
                        where("cafe_id", "==", cafe_id),
                        limit(limitNumber));
    return getDocs(first);
  }

  getNextItemsPagination(limitNumber: number, searchText: string, cafe_id, startAfterDoc: any) {
    const next = query(collection(this.firestore, 'items'),
                  where("cafe_id", "==", cafe_id),
                  startAfter(startAfterDoc),
                  limit(limitNumber));
    return getDocs(next);
  }

  getTypes(): Observable<any> {
    const typesRef = collection(this.firestore, 'types');
    const typesQuery = query(typesRef);
    return collectionData(typesQuery, { idField: 'id'}) as Observable<any>;
  }

  getCurrencies() {
    const typesRef = collection(this.firestore, 'currencies');
    const typesQuery = query(typesRef);
    return getDocs(typesQuery);
  }

  register(data) {
    const dataRef = collection(this.firestore, 'register_request');
    return addDoc(dataRef, data);
  }

}
