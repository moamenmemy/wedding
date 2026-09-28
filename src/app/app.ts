import { Component, signal } from '@angular/core';
import { Hero } from './hero/hero';
import { Countdown } from './countdown/countdown';
import { Venue } from './venue/venue';
import { WeddingTimeline } from './wedding-timeline/wedding-timeline';
import { Memories } from './memories/memories';
import { Blessing } from './blessing/blessing';
import { ScrollDown } from './scroll-down/scroll-down';


@Component({
  selector: 'app-root',
  imports: [Hero, Countdown, Venue, WeddingTimeline, Memories, Blessing, ScrollDown],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('katbKtab');
}
