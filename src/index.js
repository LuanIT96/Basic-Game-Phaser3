import { Game } from 'phaser';
import { gameConfig } from './config';

class App {
   constructor() {
        let game = new Game(gameConfig);
   }
}

new App();