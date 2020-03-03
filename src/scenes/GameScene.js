import { Scene,Math } from 'phaser';
import { constant } from '../constant/index';
import { gameConfig } from '../config';

export default class GameScene extends Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        //load audio
        this.load.audio('ballAudio', '../src/assets/audio/ballAudio.wav');

        //load image
        this.load.image('background', '../src/assets/images/background.png');
        this.load.atlas('assets', '../src/assets/images/breakout.png', '../src/assets/json/breakout.json');
    }

    create() {
        this.physics.world.setBoundsCollision(true, true, true, false);
        //add image
        this.add.image(0, 0, 'background').setOrigin(0,0);

        constant.bricks = this.physics.add.staticGroup({
            key: 'assets', frame: ['blue1', 'red1', 'green1', 'yellow1', 'silver1', 'purple1'],
            frameQuantity: 10,
            gridAlign: { width: 10, height: 6, cellWidth: 64, cellHeight: 32, x: 112, y: 100 }
        });

        //add Text
        constant.pointText = this.add.text(16, 16, 'Point:' + constant.point, { fontSize: '20px', fill: '#ffffff' });
        constant.txtNext = this.add.text(690, 16, 'Next Game', { fontSize : '20px', fill : '#000' }).setInteractive();
        constant.txtNext.on('pointerup', () => {
            gameConfig.physics.arcade.gravity.y = 300;
            this.scene.start('GameStarScene');
        });
        constant.ball = this.physics.add.image(400, 510, 'assets', 'ball1').setCollideWorldBounds(true).setBounce(1);

        constant.ball.setData('onPaddle', true);

        constant.paddle = this.physics.add.image(400, 550, 'assets', 'paddle1').setImmovable();

        //  Our colliders
        this.physics.add.collider(constant.ball, constant.bricks, this.hitBrick, null, this);
        this.physics.add.collider(constant.ball, constant.paddle, this.hitPaddle, null, this);

        //  Input events
        this.input.on('pointermove', (pointer) => {
            constant.paddle.x = Math.Clamp(pointer.x, 52, 748);
            if (constant.ball.getData('onPaddle')) {
                constant.ball.x = constant.paddle.x;
            }

        }, this);

        this.input.on('pointerup', (pointer) => {

            if (constant.ball.getData('onPaddle')) {
                constant.ball.setVelocity(-75, -300);
                constant.ball.setData('onPaddle', false);
            }

        }, this);

        //Exit Game
        constant.txtExit = this.add.text(750, 580, 'Exit', { fontSize : '20px', fill : 'red' }).setInteractive();
		constant.txtExit.on('pointerdown', () => {
			gameConfig.physics.arcade.gravity.y = 0;
			this.scene.start('PreloadScene');
		});
    }


    hitBrick(ball, brick) {
        brick.disableBody(true, true);
        //add audio
        this.sound.add('ballAudio').play();
        constant.point ++;
        constant.pointText.setText('Point:' + constant.point);
        if (constant.bricks.countActive() === 0) {
            //set point = 0
            constant.point = 0;
            constant.pointText.setText('Point:' + constant.point);
        
            this.resetLevel();
        }
    }

    resetBall() {
        constant.ball.setVelocity(0);
        constant.ball.setPosition(constant.paddle.x, 505);
        constant.ball.setData('onPaddle', true);
    }

    resetLevel() {
        this.resetBall();

        constant.bricks.children.each((brick) => {

            brick.enableBody(false, 0, 0, true, true);

        });
    }

    hitPaddle(ball, paddle) {
        var diff = 0;

        if (ball.x < paddle.x) {
            diff = paddle.x - ball.x;
            ball.setVelocityX(-10 * diff);
        }
        else if (ball.x > paddle.x) {
            diff = ball.x - paddle.x;
            ball.setVelocityX(10 * diff);
        }
        else {
            ball.setVelocityX(2 + Math.random() * 8);
        }
    }

    update() {
        if (constant.ball.y > 600) {
            this.resetBall();
        }
    }
}