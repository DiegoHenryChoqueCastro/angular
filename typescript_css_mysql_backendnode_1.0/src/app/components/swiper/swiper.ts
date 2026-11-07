import { Component, ElementRef, viewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Data } from '../../services/data';
@Component({
  selector: 'app-swiper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './swiper.html',
  styleUrl: './swiper.css',
})
export class Swiper {
  // 1. Inyectamos el servicio primero
  private productoService = inject(Data);
  // 2. Ahora ya lo puedes usar inmediatamente abajo
  productos$: Observable<any[]> = this.productoService.getDatos();



  itemOne: string = 'images/10852327587870.jpg';
  itemTwo: string = 'images/11003448524830.jpg';
  itemTree: string = 'images/11003454816286.jpg';
  itemFour: string = 'images/10852344889374.jpg';
  // Uso de la nueva API de Signals para acceder al DOM en Angular moderno
  slider = viewChild<ElementRef<HTMLElement>>('productSlider');

  private getScrollAmount(): number {
    const sliderElement = this.slider()?.nativeElement;
    if (!sliderElement) return 300;

    const firstCard = sliderElement.querySelector('.product-item-link') as HTMLElement;
    if (!firstCard) return 300;

    const style = window.getComputedStyle(sliderElement);
    const gap = parseInt(style.gap) || 20;

    return firstCard.offsetWidth + gap;
  }

  scrollPrev(): void {
    this.slider()?.nativeElement.scrollBy({
      left: -this.getScrollAmount(),
      behavior: 'smooth'
    });
  }

  scrollNext(): void {
    this.slider()?.nativeElement.scrollBy({
      left: this.getScrollAmount(),
      behavior: 'smooth'
    });
  }
}