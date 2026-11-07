import { Component } from '@angular/core';
import { Swiper } from '../../components/swiper/swiper';
import { Shop } from '../../components/shop/shop';

@Component({
  selector: 'app-store',
  imports: [Swiper, Shop],
  templateUrl: './store.html',
  styleUrl: './store.css',
})
export class Store {
  sliderStore: string = 'images/estadio-hernando-siles-escudo.jpg'
}
