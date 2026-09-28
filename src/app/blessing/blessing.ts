import { Component, ElementRef, PLATFORM_ID, afterNextRender, inject, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-blessing',
  standalone: true,
  imports: [],
  templateUrl: './blessing.html',
  styleUrl: './blessing.scss',
})
export class Blessing {
  // جلب الكارد الرئيسي باستخدام ViewChild
  @ViewChild('blessingCard') blessingCard!: ElementRef;
  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    afterNextRender(async () => {
      if (!isPlatformBrowser(this.platformId) || !this.blessingCard) return;

      const { animate } = await import('animejs');

      const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;

            // تطبيق تأثير الأنيميشن عند الظهور
            animate(el, {
              opacity: [0, 1],
              scale: [0.95, 1],
              translateY: [40, 0],
              duration: 1300,
              easing: 'easeOutQuad',
            });

            observerInstance.unobserve(el);
          }
        });
      }, {
        threshold: 0.15
      });

      const el = this.blessingCard.nativeElement;
      el.style.opacity = '0'; // إخفاء الكارد مبدئياً
      observer.observe(el);
    });
  }
}