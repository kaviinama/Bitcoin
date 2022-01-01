import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('enableStateChange',
    [
    state('first',
    style({ opacity: 0, })),
    state('second', style({ opacity: 1, })),
    transition('first=>second', animate('300ms ease-out')),
    ])
  ]
})
export class HeaderComponent implements OnInit {
  first = false;
  constructor() { }

  ngOnInit(): void {
    this.first = !this.first;
  }
}
