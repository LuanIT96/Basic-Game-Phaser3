export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({key : 'PreloadScene'});
    }

    preload() {

        //load text
        this.add.text(260, 20, 'GAME ONLINE', { fontSize : '40px', fill : '#000',  fontFamily: 'Righteous' });

        //load image
        this.load.image('playGame','../../src/assets/images/playgame.jpg');
        //load audio
        this.load.audio('audioDefault', '../../src/assets/audio/audio-default.mp3');
    }

    create() {
        let audioDefault = this.sound.add('audioDefault');
        audioDefault.play();
        //Event Click
        let playGame = this.add.image(390, 300, 'playGame').setInteractive();
        playGame.on('pointerup', () => {
            audioDefault.stop();
            this.scene.start('GameScene');
        });
    }
}