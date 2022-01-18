import Phaser from 'phaser'
const jsonData= require('../items.json');

export default class RenderScreen extends Phaser.Scene
{
    constructor() {
        super('RenderScreen');
        this.selectedItemsSelectors = null;
        this.selectedItems = [];
        this.backGrounds = [];
        this.screenCenterX = null;
        this.screenCenterY = null;
        this.setRetry = false;
        this.maxTries = 5000;
    }

    init(data) {
        this.selectedItemsSelectors = data.selectedItems;
        for (let type in jsonData) {
            this.selectedItems[type] = [];
        }
    }

    preload()
    {
        for (let type in jsonData) {
            for (let i in jsonData[type].items) {
                const item = jsonData[type].items[i];
                if (!this.selectedItemsSelectors[type].includes(item['selector'].name)) {
                    continue;
                }

                this.load.image(item['item'].name, item['item'].file);
                this.selectedItems[type].push(item['item'].name);
                console.log(item['item']);
            }
        }
    }

    create()
    {
        this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        this.screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        this.cameras.main.fadeIn(400, 0, 0, 0);
        this.cameras.main.setBackgroundColor("#fff");

        this.renderBackground();
        this.renderSprites('back', 560);
        this.renderSprites('front', 800);
    }

    renderBackground()
    {
        for (let i in this.selectedItems['background']) {
            let image = this.add.image(this.screenCenterX, this.screenCenterY, this.selectedItems['background'][i]);
            image.displayWidth = this.cameras.main.width;
            image.displayHeight = this.cameras.main.height;

            this.backGrounds.push(image);
        }

       /* for (let i = 0; i < this.backGrounds.length; i++) {
            if (i === 0) {
                continue;
            }

            this.backGrounds[i].alpha = 0;
        }*/

        this.backGrounds.reverse();

        for (let i = 0; i < this.backGrounds.length; i++) {
            if (i === 0) {
                this.backGrounds[i].alpha = 1;
                continue;
            }

            this.backGrounds[i].alpha = 0;
        }

            this.tweens.add({
                targets: this.backGrounds[0],
                alpha: 0,
                ease: 'Power1',
                duration: 3000,
                repeat: -1,
                onRepeat: () => {
                    let tempImage = this.backGrounds.shift();
                    this.backGrounds.push(tempImage);

                    for (let i = 0; i < this.backGrounds.length; i++) {
                        if (i === 0) {
                            this.backGrounds[i].alpha = 1;
                            continue;
                        }

                        this.backGrounds[i].alpha = 0;
                    }
                },
            });

    }

    renderSprites(type, y)
    {
        let sprites = [];
        let setPositions = [];

        for (let i in this.selectedItems[type]) {
            console.log( this.selectedItems[type][i]);
            let sprite = this.add.sprite(this.screenCenterX / 2.2,  y, this.selectedItems[type][i]);
            sprite.setDepth(2);
            sprites.push(sprite);

            sprites = this.shuffleArray(sprites);

            let x = 0;
            const currentTry = 0;

            let currentPosX = this.setRandomPosX(setPositions, currentTry);

            while (this.setRetry === true && currentTry <= this.maxTries) {
                currentPosX = this.setRandomPosX(setPositions, currentTry);
            }

            setPositions.push(currentPosX);
        }

        console.log(setPositions);
        for (let i in setPositions) {
            sprites[i].setPosition(setPositions[i],  y);
        }
    }

    setRandomPosX(setPositions, currentTry)
    {
        this.setRetry = false;
        let currentPosX = Math.floor(Math.random() * (window.innerWidth / 1.1 - 40 + 1)) +40;

        for (let j in setPositions) {
            while (Math.abs(setPositions[j] - currentPosX) < 150) {
                currentPosX = Math.floor(Math.random() * (window.innerWidth / 1.1 - 40 + 1)) +40;

                if (currentTry < this.maxTries) {
                    console.log(currentTry)
                    this.setRetry = true;
                }
            }
        }

        return currentPosX;
    }

    shuffleArray(array)
    {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }

        return array;
    }
}