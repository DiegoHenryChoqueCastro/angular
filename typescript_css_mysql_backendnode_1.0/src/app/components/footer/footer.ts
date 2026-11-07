import { Component, ElementRef, viewChild, afterNextRender, DestroyRef, inject } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})

export class Footer {
  logoEscudo: string = 'images/logo-club-the-strongest.png';
  
  private destroyRef = inject(DestroyRef);

  // Referencia moderna al botón usando Signals (Angular 17.3+)
  volverArriba = viewChild<ElementRef<HTMLButtonElement>>('volverArriba');

  // Año automático gestionado por TypeScript/Angular (evita usar document.getElementById)
  readonly currentYear = new Date().getFullYear();

  constructor() {
    // afterNextRender garantiza que el DOM ya está renderizado en el cliente (ideal para SSR)
    afterNextRender(() => {
      this.initScrollButton();
      this.initIntersectionObserver();
    });
  }

  private initScrollButton() {
    const btn = this.volverArriba()?.nativeElement;
    if (!btn) return;

    const actualizarBoton = () => {
      btn.classList.toggle('visible', window.scrollY > 300);
    };

    const handleScroll = () => actualizarBoton();
    window.addEventListener('scroll', handleScroll, { passive: true });
    actualizarBoton(); // Estado inicial

    const handleClick = () => {
      const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({
        top: 0,
        behavior: reducirMovimiento ? 'auto' : 'smooth'
      });
    };
    btn.addEventListener('click', handleClick);

    // Limpieza automática de eventos al destruir el componente
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('scroll', handleScroll);
      btn.removeEventListener('click', handleClick);
    });
  }

  private initIntersectionObserver() {
    const elementosAnimados = document.querySelectorAll('.footer-col, .footer-llamada');
    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if ('IntersectionObserver' in window && !reducirMovimiento) {
      const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('aparecer');
            observador.unobserve(entrada.target);
          }
        });
      }, {
        threshold: 0.12
      });

      elementosAnimados.forEach((elemento, indice) => {
        if (elemento instanceof HTMLElement) {
          elemento.style.transitionDelay = `${indice * 80}ms`;
          observador.observe(elemento);
        }
      });

      // Desconectar observador al destruir el componente
      this.destroyRef.onDestroy(() => {
        observador.disconnect();
      });
    } else {
      elementosAnimados.forEach((elemento) => {
        elemento.classList.add('aparecer');
      });
    }
  }
}