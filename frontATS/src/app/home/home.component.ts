import { Component, OnInit } from '@angular/core';
import { products } from '../core/data';
import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ApiService } from '../core/services/api.service';
import { PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: any;

   searchTerms = new FormControl('');
  category: any;
  page: any = 0;
  size: any = 100;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.getProducts({page: 0, size: 10});
    this.searchTerms.valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((value) => {
      this.page = 0;
      this.searchTerms = value;
      console.log('searchTerms', this.searchTerms);

      this.getProducts({  page : 0 , size: 10 , category: this.searchTerms});
    });
    this.getCateory();
  }

  getProducts(value) {
    this.api.getProducts(value).subscribe((value: any) => {
      console.log(value);
      this.products = value;

      // this.size = value.size;
      // this.page = value.page;
    });
  }

  getCateory() {
    this.api.getCategory().subscribe(value => {
      this.category = value;
      console.log(value);

    });
  }

  avg(item) {
    let total = 0;
    for (let i = 0; i < item.length; i++) {
      total += item[i].rating;
    }
    const avg = total / item.length;
    return Math.round(avg);
  }

  arrayConvert(n: number): any[] {
    return Array(n);
  }


  public changePage(event: PageEvent) {
    console.log('event', event.pageIndex);

    this.page = event.pageIndex;
    this.getProducts(this.page);
  }
}
