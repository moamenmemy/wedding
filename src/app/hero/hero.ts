import { Component, ElementRef, PLATFORM_ID, afterNextRender, inject, signal, ViewChildren, QueryList } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  protected readonly title = signal('katbKtab');
  
  @ViewChildren('venn') boxes!: QueryList<ElementRef>;
  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
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
              duration: 1400,
              easing: 'easeOutQuad',
            };

            if (index === 0) {
              // 1. الآية: تطلع من تحت لفوق ببطء أول ما تيجي في الشاشة
              animationConfig.translateY = [50, 0];
            } else if (index === 1) {
              // 2. الصورة: تيجي من الشمال لمكانها
              animationConfig.translateX = [-80, 0];
              animationConfig.translateY = [20, 0];
            } else if (index === 2) {
              // 3. الكلام اللي ع اليمين: ييجي من اليمين لمكانه
              animationConfig.translateX = [80, 0];
              animationConfig.translateY = [20, 0];
            }

            animate(el, animationConfig);
            observerInstance.unobserve(el);
          }
        });
      }, {
        threshold: 0.15
      });

      this.boxes.forEach((box, index) => {
        const el = box.nativeElement;
        el.setAttribute('data-index', index.toString());
        el.classList.add('venn-hidden'); // الكل هيبدأ مخفي
        observer.observe(el);
      });
    });
  }
}