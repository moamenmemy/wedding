import { Component, ElementRef, PLATFORM_ID, afterNextRender, inject, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TimelineEvent } from './interface/weddingTimeLine';

@Component({
  selector: 'app-wedding-timeline',
  imports: [],
  templateUrl: './wedding-timeline.html',
  styleUrl: './wedding-timeline.scss',
})
export class WeddingTimeline {
timelineEvents: TimelineEvent[] = [
    {
      time: '08:00 مساءً',
      title: 'بداية الحفل واستقبال الضيوف',
      description: 'حضور الأهل والأحباب وبداية التجمع في قاعة سندريلا.',
      icon: 'fa-solid fa-door-open'
    },
    {
      time: '08:00 م - 09:00 م',
      title: 'مراسم عقد القران (كتب الكتاب)',
      description: 'اللحظات المباركة لإعلان الزواج وتوقيع وثيقة عقد القران بحضور المأذون والضيوف الكرام.',
     icon: 'fa-solid fa-file-signature'
    },
    {
      time: '09:00 م - 10:00 م',
      title: 'جلسة التصوير والاحتفال',
      description: 'التقاط الصور التذكارية للعروسين مع العائلة والأصدقاء وسط أجواء ممتعة وسعيدة.',
      icon: 'fa-solid fa-camera-retro'
    },
    {
      time: '11:00 مساءً',
      title: 'ختام الحفل',
      description: 'نهاية الحفل ومغادرة الضيوف مع أطيب الأمنيات بذكريات لا تُنسى.',
      icon: 'fa-solid fa-star'
    }
  ];
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
