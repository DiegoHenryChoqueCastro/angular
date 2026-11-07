import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Data } from '../../services/data';

@Component({
  selector: 'app-short',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './short.html',
  styleUrl: './short.css'
})
export class Short implements OnInit {
  private route = inject(ActivatedRoute);
  private dataService = inject(Data);

  videoData = signal<any[]>([]);

  ngOnInit(): void {
    const videoId = this.route.snapshot.paramMap.get('id');

    if (videoId) {
      this.dataService.getShortsOrderedFirst(videoId).subscribe({
        next: (data) => {
          this.videoData.set(data);
        },
        error: (err) => {
          console.error('Error al cargar los videos:', err);
        }
      });
    }
  }

  // ===== Control de Reproducción / Pausa =====
  togglePlay(videoElement: HTMLVideoElement, overlayElement: HTMLElement): void {
    if (videoElement.paused) {
      videoElement.play()
        .then(() => {
          overlayElement.style.display = 'none';
        })
        .catch(() => {});
    } else {
      videoElement.pause();
      overlayElement.style.display = 'block';
    }
  }

  // ===== Control de Audio (Mute / Unmute) =====
  toggleAudio(videoElement: HTMLVideoElement): void {
    if (videoElement.muted || videoElement.volume === 0) {
      videoElement.volume = 1;
      videoElement.muted = false;
    } else {
      videoElement.volume = 0;
      videoElement.muted = true;
    }
  }

  // ===== Control del Slider de Volumen =====
  changeVolume(event: any, videoElement: HTMLVideoElement): void {
    const nivel = parseFloat(event.target.value) / 100;
    videoElement.volume = nivel;
    videoElement.muted = (nivel === 0);
  }

  // ===== Navegación entre slides =====
  moverSlider(direccion: 'siguiente' | 'anterior'): void {
    const shortFeed = document.querySelector('.short-feed');
    if (!shortFeed) return;

    //Pausar, silenciar y mostrar el overlay en todos los videos
    const videos = shortFeed.querySelectorAll('video') as NodeListOf<HTMLVideoElement>;
    videos.forEach(video => {
      video.pause();
      //video.muted = true;

      //Buscar el botón de overlay correspondiente dentro del mismo contenedor del video
      const container = video.closest('.short-video-frame');
      const overlayElement = container?.querySelector('.short-play-overlay') as HTMLElement;
      
      if (overlayElement) {
        overlayElement.style.display = 'block'; // Mostrar el botón de play
      }
    });

    //Realizar el scroll del feed
    const alturaSlide = shortFeed.clientHeight;
    shortFeed.scrollBy({
      top: direccion === 'siguiente' ? alturaSlide : -alturaSlide,
      behavior: 'smooth'
    });

  }
}