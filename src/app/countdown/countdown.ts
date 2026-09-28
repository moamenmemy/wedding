import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef, ElementRef, PLATFORM_ID, afterNextRender, inject, ViewChildren, QueryList } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [],
  templateUrl: './countdown.html',
  styleUrl: './countdown.scss',
})
export class Countdown implements OnInit, OnDestroy {
  days: number = 0;
  hours: string = '00';
  minutes: string = '00';
  seconds: string = '00';
  private timer: any;

  // تاريخ زفافكم (17 أكتوبر 2026)
  private targetDate: Date = new Date('2026-10-17T20:00:00');

  // جلب العناصر التي تحمل الـ reference باسم venn
  @ViewChildren('venn') boxes!: QueryList<ElementRef>;
  private readonly platformId = inject(PLATFORM_ID);

  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    afterNextRender(async () => {
      if (!isPlatformBrowser(this.platformId) || !this.boxes || this.boxes.length === 0) return;

      const { animate } = await import('animejs');

      const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const index = Number(el.getAttribute('data-index')) || 0;

            let animationConfig: any = {
              opacity: [0, 1],
              duration: 1200,
              easing: 'easeOutQuad',
            };

            if (index === 0) {
              // البرواز الرئيسي: يكبر تدريجياً مع ظهور شفافية
              animationConfig.scale = [0.95, 1];
              animationConfig.translateY = [30, 0];
            } else {
              // باقي العناصر الداخلية
              animationConfig.translateY = [40, 0];
            }

            animate(el, animationConfig);
            observerInstance.unobserve(el);
          }
        });
      }, {
        threshold: 0.1
      });

      this.boxes.forEach((box, index) => {
        const el = box.nativeElement;
        el.setAttribute('data-index', index.toString());
        // جعل العناصر مخفية مبدئياً قبل بدء الأنيميشن
        el.style.opacity = '0';
        observer.observe(el);
      });
    });
  }

  ngOnInit(): void {
    this.updateCountdown();
    
    this.ngZone.runOutsideAngular(() => {
      this.timer = setInterval(() => {
        this.updateCountdown();
        this.cdr.detectChanges();
      }, 1000);
    });
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private updateCountdown(): void {
    const now = new Date().getTime();
    const distance = this.targetDate.getTime() - now;

    if (distance < 0) {
      this.days = 0;
      this.hours = '00';
      this.minutes = '00';
      this.seconds = '00';
      if (this.timer) clearInterval(this.timer);
      return;
    }

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    this.days = d;
    this.hours = h < 10 ? '0' + h : h.toString();
    this.minutes = m < 10 ? '0' + m : m.toString();
    this.seconds = s < 10 ? '0' + s : s.toString();
  }
}