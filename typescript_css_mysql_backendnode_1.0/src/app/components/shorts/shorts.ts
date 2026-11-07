import { CommonModule } from '@angular/common';
import { Component, ElementRef, viewChildren, AfterViewInit, inject, effect } from '@angular/core';
import { Observable } from 'rxjs';
import { Data } from '../../services/data';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shorts',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './shorts.html',
  styleUrl: './shorts.css',
})
export class Shorts {
  private shortService = inject(Data);
  shorts$: Observable<any[]> = this.shortService.getShorts();

  // Obtenemos referencias tipadas de todas las tarjetas de la vista
  private readonly cards = viewChildren<ElementRef<HTMLElement>>('shortCard');

  constructor() {
    // El effect se ejecutará automáticamente apenas las tarjetas aparezcan en el DOM,
    // ya sea la primera vez o cuando regreses con el botón "Atrás" y se recarguen los datos.
    effect(() => {
      const cardElements = this.cards();
      
      if (cardElements.length > 0) {
        // Damos un pequeño respiro para asegurar que el DOM esté completamente listo
        setTimeout(() => {
          this.inicializarVideos(cardElements);
        }, 50);
      }
    });
  }

  private inicializarVideos(cardElements: readonly ElementRef<HTMLElement>[]): void {
    cardElements.forEach((cardRef) => {
      const card = cardRef.nativeElement;
      const video = card.querySelector<HTMLVideoElement>('.short-video-preview');
      const progressFill = card.querySelector<HTMLElement>('.short-progress-fill');

      if (!video || !progressFill) return;

      let playPromise: Promise<void> | null = null;

      const playVideo = (): void => {
        video.currentTime = 0;
        card.classList.add('is-playing');

        playPromise = video.play();
        if (playPromise !== null) {
          playPromise.catch(() => {
            card.classList.remove('is-playing');
          });
        }
      };

      const resetCardState = (): void => {
        card.classList.remove('is-playing');

        if (playPromise !== null) {
          playPromise
            .then(() => {
              video.pause();
              video.currentTime = 0;
            })
            .catch(() => {});
        } else {
          video.pause();
          video.currentTime = 0;
        }

        progressFill.style.width = '0%';
      };

      // Limpiamos eventos previos por si acaso se vuelve a reasignar el effect
      video.ontimeupdate = null;
      video.onended = null;
      card.onmouseenter = null;
      card.onmouseleave = null;

      // Eventos del video
      video.addEventListener('timeupdate', () => {
        if (video.duration) {
          const percentage = (video.currentTime / video.duration) * 100;
          progressFill.style.width = `${percentage}%`;
        }
      });

      video.addEventListener('ended', resetCardState);

      // Eventos del contenedor
      card.addEventListener('mouseenter', playVideo);
      card.addEventListener('mouseleave', resetCardState);
    });
  }
}