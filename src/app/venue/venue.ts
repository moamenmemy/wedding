import { Component, ElementRef, ViewChild, PLATFORM_ID, inject, afterNextRender, ViewChildren, QueryList } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-venue',
  standalone: true,
  imports: [],
  templateUrl: './venue.html',
  styleUrl: './venue.scss',
})
export class Venue {
  @ViewChild('box') box!: ElementRef;
  @ViewChildren('venueCard') venueCards!: QueryList<ElementRef>;
  // جلب الزر لتغيير النص بداخله
  @ViewChild('copyBtn') copyBtn!: ElementRef;

  // رابط القاعة المراد نسخه
  private mapUrl: string = 'https://www.google.com/maps/place/%D9%86%D8%A7%D8%AF%D9%8A+%D8%A7%D9%84%D8%AA%D8%AC%D8%A7%D8%B1%D9%8A%D9%8A%D9%86%E2%80%AD/@31.240308,29.9553921,17z/data=!3m1!4b1!4m6!3m5!1s0x14f5c520c070423b:0xfcd7e0db76d63ef8!8m2!3d31.240308!4d29.9553921!16s%2Fg%2F11cn3hg0gd!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D';
  
  private platformId = inject(PLATFORM_ID);

  constructor() {
    afterNextRender(async () => {
      if (!isPlatformBrowser(this.platformId)) return;

      const { animate, stagger } = await import('animejs');

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && this.venueCards && this.venueCards.length > 0) {
            animate(this.venueCards.map(card => card.nativeElement), {
              opacity: [0, 1],
              translateY: [50, 0],
              translateX: (el, i) => i === 0 ? [100, 0] : [-100, 0],
              delay: stagger(300),
              duration: 1500,
              easing: 'easeOutExpo'
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      if (this.box && this.box.nativeElement) {
        observer.observe(this.box.nativeElement);
      }
    });
  }

  // الدالة الجديدة المسؤولة عن النسخ
  public copyMapLink(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // استخدام واجهة الـ Clipboard للنسخ
    navigator.clipboard.writeText(this.mapUrl).then(() => {
      // في حال نجاح النسخ:
      if (this.copyBtn && this.copyBtn.nativeElement) {
        const btnSpan = this.copyBtn.nativeElement.querySelector('span');
        const originalText = btnSpan.innerText;
        
        // تغيير النص مؤقتاً للتأكيد
        btnSpan.innerText = '✓ تم نسخ الرابط';
        btnSpan.style.color = '#4ade80'; // لون أخضر (Tailwind green-400)

        // العودة للنص الأصلي بعد ثانيتين
        setTimeout(() => {
          btnSpan.innerText = originalText;
          btnSpan.style.color = ''; // العودة للون الأصلي
        }, 2000);
      }
    }).catch(err => {
      // في حال فشل النسخ (نادرة الحدوث في المتصفحات الحديثة):
      console.error('فشل النسخ: ', err);
      alert('تعذر نسخ الرابط، يرجى نسخه يدوياً.');
    });
  }
}