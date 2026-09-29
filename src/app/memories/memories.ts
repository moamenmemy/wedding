import { Component, ElementRef, PLATFORM_ID, afterNextRender, inject, ViewChildren, QueryList } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { MemoryItem } from './interface/memories';

@Component({
  selector: 'app-memories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './memories.html',
  styleUrl: './memories.scss',
})
export class Memories {
  memoriesList: MemoryItem[] = [
    {
      imageUrl: '/me9.jpeg',
      date: '2021',
      spanClass: 'col-span-2 row-span-2' // صورة رئيسية كبيرة
    },
    {
      imageUrl: '/me1.jpeg',
      date: '2025',
      spanClass: 'col-span-1 row-span-1'
    },
    {
      imageUrl: '/me7.jpeg',
      date: '2021',
      spanClass: 'col-span-1 row-span-2' // صورة طولية مميزة
    },
    {
      imageUrl: '/me3.jpeg',
      date: '2024',
      spanClass: 'col-span-1 row-span-1'
    }
  ];

  // جلب كل كارد صورة كعناصر متعددة
  @ViewChildren('memoryCard') memoryCards!: QueryList<ElementRef>;
  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    afterNextRender(async () => {
      if (!isPlatformBrowser(this.platformId) || !this.memoryCards || this.memoryCards.length === 0) return;

      const { animate } = await import('animejs');

      const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const index = Number(el.getAttribute('data-index')) || 0;

            let animationConfig: any = {
              opacity: [0, 1],
              duration: 500,
              easing: 'easeOutQuad',
            };

            // توزيع اتجاهات الحركة بناءً على ترتيب أو مكان الصور
            switch (index) {
              case 0: // الصورة الكبرى الأولى (تأتي من اليسار للأسفل مثلاً أو الأعلى)
                animationConfig.translateX = [-60, 0];
                animationConfig.translateY = [-40, 0];
                break;
              case 1: // الصورة العلوية اليمنى (تأتي من اليمين للأعلى)
                animationConfig.translateX = [60, 0];
                animationConfig.translateY = [-40, 0];
                break;
              case 2: // الصورة الطولية (تأتي من اليمين مباشرة)
                animationConfig.translateX = [80, 0];
                break;
              case 3: // الصورة السفلية (تأتي من الأسفل)
                animationConfig.translateY = [60, 0];
                break;
              default:
                animationConfig.translateY = [50, 0];
            }

            animate(el, animationConfig);
            observerInstance.unobserve(el);
          }
        });
      }, {
        threshold: 0.15
      });

      this.memoryCards.forEach((card, index) => {
        const el = card.nativeElement;
        el.setAttribute('data-index', index.toString());
        el.style.opacity = '0'; // إخفاء الصورة مبدئياً
        observer.observe(el);
      });
    });
  }
}