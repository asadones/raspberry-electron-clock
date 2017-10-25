import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentDateTime;
  timer;

  constructor() {
    this.currentDateTime = Date.now();
    setInterval(() => {this.currentDateTime = Date.now()}, 1000);
  }

  ngOnInit() {
  }

}
