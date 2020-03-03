import { constant2 } from '../constant/index';
import { gameConfig } from '../config';

export default class GameStarScene extends Phaser.Scene {
    constructor() {
		super({key : 'GameStarScene'});
		gameConfig.physics.arcade.gravity.y = 300;
    }

    preload() {

		//load Audio
		this.load.audio('starAudio','../../src/assets/audio/starAudio.wav');
		this.load.audio('gameOverAudio','../../src/assets/audio/gameOverAudio.mp3');

		//load image
		this.load.image('sky', '../../src/assets/images/sky.png');
		this.load.image('ground', '../../src/assets/images/platform.png');
		this.load.image('loader', '../../src/assets/images/loader.gif');
		this.load.image('star', '../../src/assets/images/star.png');
		this.load.image('bomb', '../../src/assets/images/bomb.png');
		this.load.spritesheet('dude', '../../src/assets/images/dude.png', { frameWidth: 32, frameHeight: 48 });
	}

	create() {
		this.add.image(400, 300, 'sky');
		constant2.platforms = this.physics.add.staticGroup();

		constant2.platforms.create(290, 568, 'loader').setScale(5).refreshBody();

		//add platforms
		constant2.platforms.create(600, 400, 'ground');
		constant2.platforms.create(50, 250, 'ground');
		constant2.platforms.create(750, 220, 'ground');

		constant2.player = this.physics.add.sprite(100, 450, 'dude');

		constant2.player.setBounce(0.2);
		constant2.player.setCollideWorldBounds(true);

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'turn',
			frames: [{ key: 'dude', frame: 4 }],
			frameRate: 20
		});

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
		});

		constant2.cursors = this.input.keyboard.createCursorKeys();

		//add star
		constant2.stars = this.physics.add.group({
			key: 'star',
			repeat: 13,
			setXY: { x: 12, y: 0, stepX: 60 }
		});


		//add bomb
		constant2.bombs = this.physics.add.group();

		//add Text total
		constant2.totalText = this.add.text(690, 16, 'Point:'+constant2.total, { fontSize: '20px', fill: '#000000' });
		constant2.levelText = this.add.text(350, 16, 'Level:'+constant2.level, {fontSize : '20px' , fill : '#fff'});
		constant2.firstGame = this.add.text(16, 16, 'First Game', { fontSize : '20px', fill: '#000000' }).setInteractive();
		//Event pointerup
		constant2.firstGame.on('pointerup', () => {
			gameConfig.physics.arcade.gravity.y = 0;
			this.scene.start('GameScene');
		});

		//stop game
		constant2.txtExit = this.add.text(360, 560, 'Exit', { fontSize : '20px', fill : 'red' }).setInteractive();
		constant2.txtExit.on('pointerdown', () => {
			gameConfig.physics.arcade.gravity.y = 0;
			this.scene.start('PreloadScene');
		});

		this.physics.add.collider(constant2.player, constant2.platforms);
		this.physics.add.collider(constant2.stars, constant2.platforms);
		this.physics.add.collider(constant2.bombs, constant2.platforms);
		
		this.physics.add.overlap(constant2.player, constant2.stars, this.collectStar, null, this);
		this.physics.add.collider(constant2.player, constant2.bombs, this.hitBomb, null, this);
	}

	update() {
		if (constant2.gameOver) {
			return;
		}

		//Event Keyboard
		if (constant2.cursors.left.isDown) {
			constant2.player.setVelocityX(-200);

			constant2.player.anims.play('left', true);
		}
		else if (constant2.cursors.right.isDown) {
			constant2.player.setVelocityX(200);

			constant2.player.anims.play('right', true);
		}
		else {
			constant2.player.setVelocityX(0);

			constant2.player.anims.play('turn');
		}

		if (constant2.cursors.up.isDown && constant2.player.body.touching.down) {
			constant2.player.setVelocityY(-330);
		}
	}

	collectStar(player, star) {
		star.disableBody(true, true);
		//add audio
		this.sound.add('starAudio').play();

		constant2.total+= 10;
		constant2.totalText.setText('Point:'+constant2.total);

		if (constant2.stars.countActive(true) === 0) {
			constant2.level+= 1;
			constant2.levelText.setText('Level:'+constant2.level);
			constant2.stars.children.iterate( (child) => {
				child.enableBody(true, child.x, 0, true, true);
			});

			var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

			//create bomb
			var bomb = constant2.bombs.create(x, 16, 'bomb');
			bomb.setBounce(1);
			bomb.setCollideWorldBounds(true);
			bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
			bomb.allowGravity = false;
		}
	}

	hitBomb(player, bomb) {
		this.physics.pause();
		player.setTint(0xff0000);
		player.anims.play('turn');
		constant2.gameOver = true;
		if(constant2.gameOver === true) {
			//add audio game over
			this.sound.add('gameOverAudio').play();
			alert('Game Over');
		}
		//reset Game
		this.resetGame();
	}

	resetGame() {
		constant2.total = 0;
		constant2.totalText.setText('Point:'+constant2.total);
		constant2.level = 0;
		constant2.levelText.setText('Level:' + constant2.level);
		constant2.gameOver = false;
		this.scene.start('GameStarScene');
	}
}