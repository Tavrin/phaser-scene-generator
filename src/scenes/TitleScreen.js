import Phaser from 'phaser'

const centerWidth = window.innerWidth / 2;
const centerHeight = window.innerHeight / 2;

export default class TitleScreen extends Phaser.Scene
{
    constructor()
    {
        super('TitleScreen')
    }

    preload()
    {
        this.load.bitmapFont('avertaWhite', 'public/assets/font/averta2_0.png', 'public/assets/font/averta2.xml');
        this.load.image('bgc', 'public/assets/img/bgc-splash.jpg')
        this.load.image('startButton', 'public/assets/img/startButtonDarkText.png')
    }

    create()
    {
        this.add.image(centerWidth, centerHeight, 'bgc')
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        let startButton = this.add.bitmapText(centerWidth -600, centerHeight + 100, 'avertaWhite', "Mode En ligne", 72).setInteractive();
        let startButtonQrMode = this.add.bitmapText(centerWidth + 100, centerHeight + 100, 'avertaWhite', "Mode QR Code", 72).setInteractive();
        let text = this.add.bitmapText(screenCenterX / 1.7, centerHeight - 100, 'avertaWhite', "GENERATEUR D'HISTOIRES", 72);

        startButton.on('pointerdown', () => {
            this.cameras.main.fadeOut(200, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                this.scene.start('GameScreen');
            })
        })

        startButtonQrMode.on('pointerdown', () => {
            this.cameras.main.fadeOut(200, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                this.scene.start('GameScreenQrMode');
            })
        })
    }
}