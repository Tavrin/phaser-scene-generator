import Phaser from 'phaser'
const jsonData= require('../items.json');

export default class RenderScreen extends Phaser.Scene
{
    constructor() {
        super('RenderScreen');
        this.selectedItems = null;
        this.screenCenterX = null;
        this.screenCenterY = null;
        this.setRetry = false;
        this.maxTries = 5000;
    }

    init(data) {
        this.selectedItems = data.selectedItems;
    }

    preload()
    {
        /*for (let type in jsonData) {
            for (let i in jsonData[type].items) {
                const item = jsonData[type].items[i];
                if (!this.selectedItems[type].includes(item.name)) {
                    continue;
                }

                this.load.image(item.name, item.file);
            }
        }*/
    }

    create()
    {
        this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        this.screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        this.cameras.main.fadeIn(400, 0, 0, 0);
        this.cameras.main.setBackgroundColor("#fff");

        this.renderSprites('front', 800);
        this.renderSprites('back', 500);
    }

    renderSprites(type, y)
    {
        let sprites = [];
        let setPositions = [];

        for (let i in this.selectedItems[type]) {
            let sprite = this.add.sprite(this.screenCenterX / 2.2,  y, this.selectedItems[type][i]);
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
        let currentPosX = Math.floor(Math.random() * (window.innerWidth / 1.1 - 40 + 1)) +10;

        for (let j in setPositions) {
            while (Math.abs(setPositions[j] - currentPosX) < 150) {
                currentPosX = Math.floor(Math.random() * (window.innerWidth / 1.1 - 40 + 1)) +10;

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