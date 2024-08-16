import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
    id: number;
    name: string;
    isActive: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private apiUrl = 'https://localhost:7249/api/category';

    constructor(private http: HttpClient) { }

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(this.apiUrl);
    }
    addCaregory(category: any): Observable<any>{
        return this.http.post<any>(`${this.apiUrl}`,category)
    }
    updateCategory(category: any): Observable<any> {
        debugger
        return this.http.put<any>(`${this.apiUrl}/${category.categoryID}`, category);
      }
    
      deleteCategory(categoryID: number): Observable<any> {
        debugger
        return this.http.delete<any>(`${this.apiUrl}/${categoryID}`);
      }

}
