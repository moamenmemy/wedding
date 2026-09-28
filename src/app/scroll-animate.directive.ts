import { Directive, ElementRef, PLATFORM_ID, inject, afterNextRender } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appScrollAnimate]',
  standalone: true,
})
export class ScrollAnimateDirective {
  private el = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);

  constructor() {
    afterNextRender(async () => {
      // التأكد إن الكود شغال في المتصفح فقط عشان الـ SSR
      if (isPlatformBrowser(this.platformId)) {
        try {
          const { animate, onScroll } = await import('animejs');

          // إخفاء العنصر تماماً في البداية وتحريكه لتحت شوية
          this.el.nativeElement.style.opacity = '0';
          this.el.nativeElement.style.transform = 'translateY(60px)';

          // تشغيل أنيميشن الظهور أول ما المستخدم يعمل سكرول لعند العنصر
animate(this.el.nativeElement, {
            translateY: [60, 0],
            opacity: [0, 1],
            duration: 900,
            easing: 'easeOutQuad',
            autoplay: onScroll({
              target: this.el.nativeElement,
              sync: 'play',
              enter: 'top 85%',
            }),
          
          });
        } catch (error) {
          console.error('Animation error:', error);
        }
      }
    });
  }
}