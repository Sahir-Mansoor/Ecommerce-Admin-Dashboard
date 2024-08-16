import { Component, OnInit, } from '@angular/core';
import { CategoryService, Category} from '../../service/category.services';
import { empty } from 'rxjs';


@Component({
  templateUrl: './categories.component.html'
})
export class CategoriesComponent{
  categories: Category[] = [];
  showpopup: boolean = false;
  category_Name: string = '';
  isActive: boolean = true ;
  isEditMode: boolean = false;
  currentCategoryID: number | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  pageSize = 5;
  pageSizes = [5, 10, 20, 50]; 
  constructor(private categoryservice: CategoryService) {}

ngOnInit(): void {
  this.fetchcategories();
  }
  fetchcategories(){
    this.categoryservice.getCategories().subscribe(
      data=> {
        this.categories= data;
        this.totalItems=data.length;
        this.updatePageData();
      });
      
  }
  openPopup() {
    this.isEditMode = false;
    this.category_Name = '';
    this.isActive = true;
    this.showpopup = true;
  }

  closePopup(): void {
    this.showpopup = false;
   }
   
  addCategory(): void {
    const newCategory = {
      category_Name: this.category_Name,
      isActive: this.isActive
    };
    this.categoryservice.addCaregory(newCategory).subscribe(category => {
      this.categories.push(category);
      this.fetchcategories();
      this.closePopup();
    });
 }
 onPageSizeChange(event: any): void {
  this.itemsPerPage = +event.target.value;
  this.currentPage = 1;
  this.updatePageData();
}
updatePageData(): void {
  const newTotalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  if (this.currentPage > newTotalPages) {
    this.currentPage = newTotalPages;
  }
}
getPaginatedReceivings(): Category[] {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  return this.categories.slice(start, end);
}
get paginatedReceivings(): any[] {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  return this.categories.slice(start, end);
}
onPageChange(page: number): void {
  if (page > 0 && page <= this.totalPages) {
    this.currentPage = page;
  }
}
get totalPages(): number {
  return Math.ceil(this.totalItems / this.itemsPerPage);
}


get pageNumbers(): number[] {
  return Array.from({ length: this.totalPages }, (_, i) => i + 1);
}

 editCategory(category: any) {
  this.isEditMode = true;
  this.currentCategoryID = category.categoryID;
  this.category_Name = category.category_Name;
  this.isActive = category.isActive;
  this.showpopup = true;
}

updateCategory() {
  const updatedCategory = {
    categoryID: this.currentCategoryID,
    category_Name: this.category_Name,
    isActive: this.isActive
  };
  this.categoryservice.updateCategory(updatedCategory).subscribe(() => {
    this.fetchcategories();
    this.closePopup();
  });
}

deleteCategory(categoryID: number, categoryName: string) {
  debugger
  const isConfirmed = confirm(`Are you sure you want to delete category ${categoryName}?`);
  if (isConfirmed) {
    this.categoryservice.deleteCategory(categoryID).subscribe(() => {
      this.fetchcategories();
      if (this.categories.length === 0){
        alert('You Cannot Delete a Category having Products');
      }
    });
  }
  }
}
