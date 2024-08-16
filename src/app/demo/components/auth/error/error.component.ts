import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
})
export class ErrorComponent implements OnInit{ 

errorMessage: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get the error message from the route data
    this.route.queryParams.subscribe(params => {
      this.errorMessage = params['message'] || 'An error occurred';
    });
  }
}