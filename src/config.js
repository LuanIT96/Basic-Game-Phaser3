import { WEBGL } from 'phaser';
import GameScene from './scenes/GameScene';
import PreloadScene from './scenes/PreloadScene';
import GameStarScene from './scenes/GameStarScene';

export const gameConfig = {
    type : WEBGL,
    parent : 'Example-Phaser',
    width : 800,
    height : 600,
    backgroundColor : '#01509b',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene : [ PreloadScene, GameScene, GameStarScene ]
}