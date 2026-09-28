import { Component } from '@angular/core';

@Component({
  selector: 'app-scroll-down',
  imports: [],
  templateUrl: './scroll-down.html',
  styleUrl: './scroll-down.scss',
})
export class ScrollDown {
scrollToNext() {
    window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
  }
}
