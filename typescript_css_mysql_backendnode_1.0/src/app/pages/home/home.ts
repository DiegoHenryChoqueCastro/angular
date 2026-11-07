import { Component, HostListener, OnInit, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Quick} from '../../components/quick/quick';
import { Swiper } from '../../components/swiper/swiper';
import { Shorts } from '../../components/shorts/shorts';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Quick, Swiper, Shorts],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy{
  sliderUno: string = 'images/estadio-lego-club-the-strongest.png'
  sliderDos: string = 'images/estadio-hernando-siles-escudo.jpg'
  sliderTres: string = 'images/slider-tigre-estadio.png'
  readonly TOTAL_SLIDES = 3;
  readonly AUTOPLAY_TIME = 5000;
  readonly TRANSITION_TIME = 600;
  readonly MIN_SWIPE_DISTANCE = 50;

  // Manejo de estado reactivo con Signals
  currentSlide = signal<number>(0);
  transitionEnabled = signal<boolean>(false);
  
  // Computed para saber qué punto (dot) está activo
  activeIndex = computed(() => this.currentSlide() >= this.TOTAL_SLIDES ? 0 : this.currentSlide());
  
  // Array auxiliar para renderizar los indicadores
  dots = Array.from({ length: this.TOTAL_SLIDES }, (_, i) => i);

  private isAnimating = false;
  private autoplayTimer: any = null;
  private touchStartX = 0;
  private touchEndX = 0;

  ngOnInit() {
    this.moveToSlide(0, false);
    this.startAutoplay();
  }

  ngOnDestroy() {
    this.stopAutoplay();
  }

  moveToSlide(index: number, animate: boolean = true) {
    if (this.isAnimating && animate) return;

    this.isAnimating = animate;
    this.transitionEnabled.set(animate);
    this.currentSlide.set(index);
  }

  nextSlide() {
    if (this.isAnimating) return;
    this.moveToSlide(this.currentSlide() + 1);
  }

  previousSlide() {
    if (this.isAnimating || this.currentSlide() === 0) return;
    this.moveToSlide(this.currentSlide() - 1);
  }

  goToSlide(index: number) {
    this.moveToSlide(index);
    this.restartAutoplay();
  }

  onTransitionEnd() {
    this.isAnimating = false;
    
    // Reseteo silencioso (clon)
    if (this.currentSlide() === this.TOTAL_SLIDES) {
      this.moveToSlide(0, false);
    }
  }

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayTimer = setInterval(() => {
      this.nextSlide();
    }, this.AUTOPLAY_TIME);
  }

  stopAutoplay() {
    if (this.autoplayTimer !== null) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  restartAutoplay() {
    this.startAutoplay();
  }

  @HostListener('document:visibilitychange')
  onVisibilityChange() {
    if (document.hidden) {
      this.stopAutoplay();
    } else {
      this.startAutoplay();
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      this.previousSlide();
      this.restartAutoplay();
    }
    if (event.key === 'ArrowRight') {
      this.nextSlide();
      this.restartAutoplay();
    }
  }

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  private handleSwipe() {
    const distance = this.touchEndX - this.touchStartX;

    if (Math.abs(distance) < this.MIN_SWIPE_DISTANCE) return;

    if (distance < 0) {
      this.nextSlide();
    } else {
      this.previousSlide();
    }
    this.restartAutoplay();
  }
}