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
        this.load.image('bgc', 'public/assets/img/bgc-splash.jpg')
        this.load.image('startButton', 'public/assets/img/startButtonDarkText.png')
    }

    create()
    {
        this.add.image(centerWidth, centerHeight, 'bgc')
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        let startButton = this.add.sprite(centerWidth, centerHeight + 100, 'startButton').setInteractive();
        this.add.text(screenCenterX / 1.7, centerHeight - 100, "GENERATEUR D'IMAGES", {fontFamily: 'font1, sans-serif', fontSize: '4rem', fill: '#fff', align: 'center' });

        startButton.on('pointerdown', () => {
            this.cameras.main.fadeOut(200, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                this.scene.start('GameScreen');
            })
        })
    }
}