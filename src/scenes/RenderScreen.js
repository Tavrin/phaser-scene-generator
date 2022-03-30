import Phaser from 'phaser'
const jsonData= require('../items.json');
const MINIMAL_DISTANCE = 250;

export default class RenderScreen extends Phaser.Scene
{
    constructor() {
        super('RenderScreen');
        this.isResetting = false;
        this.selectedItemsSelectors = null;
        this.selectedItems = [];
        this.previousScene = null;
        this.backGrounds = [];
        this.screenCenterX = null;
        this.screenCenterY = null;
        this.maxTries = 5000;
        this.escapeKey = null;
    }

    init(data) {
        this.selectedItemsSelectors = data.selectedItems;
        this.previousScene = data.scene;
        for (let type in jsonData) {
            this.selectedItems[type] = [];
        }

        this.selectedItems['backgroundColor'] = [];
    }

    preload()
    {
        for (let selectedItemType in this.selectedItemsSelectors) {
            for (let selectedItem in this.selectedItemsSelectors[selectedItemType]) {
                for (let type in jsonData) {
                    for (let i in jsonData[type].items) {
                        const item = jsonData[type].items[i];
                        if (this.selectedItemsSelectors[selectedItemType][selectedItem] !==item ['selector'].name) {
                            continue;
                        }

                        if (item.type && item.type === 'color') {
                            this.selectedItems['backgroundColor'].push(item['item'].color)

                            continue;
                        }

                        if (type === 'sound') {
                            this.load.audio(item['item'].name, item['item'].file);
                            let soundData = {
                                'item': item['item'].name,
                                'text' : decodeURIComponent(escape(item['selector'].text))
                            };

                            this.selectedItems[type].push(soundData);

                            continue;
                        } else {
                            this.load.image(item['item'].name, item['item'].file);
                        }

                        this.selectedItems[type].push(item['item'].name);
                    }
                }
            }
        }
    }

    create()
    {
        this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        this.screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        this.escapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.cameras.main.fadeIn(400, 0, 0, 0);
        this.cameras.main.setBackgroundColor("#fff");
        this.scene.remove(this.previousScene);
        this.renderBackground();
        this.renderSprites('back', 560);
        this.renderSprites('front', 800);
        console.log(this.selectedItems['sound']);
        this.setAudio();
    }

    update(time, delta) {
        super.update(time, delta);

        if (this.escapeKey.isDown && false === this.isResetting) {
            this.isResetting = true;
            this.reset();
        }
    }

    setAudio(index = 0)
    {
        if (0 === this.selectedItems['sound'].length) {
            return;
        }

        console.log(this.selectedItems['sound'][index].item);
        let text = this.add.bitmapText(this.screenCenterX / 1.5, this.screenCenterY - 300, 'averta', this.selectedItems['sound'][index].text, 72);
        text.setDepth(999);
        let sound = this.sound.add(this.selectedItems['sound'][index].item)
        sound.play();
        sound.on('complete', () => {
            text.destroy();
            if (index < this.selectedItems['sound'].length - 1) {
                this.setAudio(++index)
            }
        })
    }

    renderBackground()
    {
        for (let i in this.selectedItems['background']) {
            let image = this.add.image(this.screenCenterX, this.screenCenterY, this.selectedItems['background'][i]);
            image.displayWidth = this.cameras.main.width;
            image.displayHeight = this.cameras.main.height;

            this.backGrounds.push(image);
        }

        if (this.selectedItems['backgroundColor'].length > 0) {
            this.selectedItems['backgroundColor'] = this.shuffleArray(this.selectedItems['backgroundColor']);
            let colors = [];
            let lastColor = null;
            for (let i in this.selectedItems['backgroundColor']) {
                if (i >= 4) {
                    lastColor = this.selectedItems['backgroundColor'][i].replace('#', '0x');
                    continue;
                }

                colors.push(this.selectedItems['backgroundColor'][i].replace('#', '0x'))
            }

            let graphics = this.add.graphics();
            graphics.fillGradientStyle(colors[0], colors[1] ?? colors[0],colors[2] ?? colors[1] ?? colors[0],colors[3] ?? colors[0]);
            graphics.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

            this.backGrounds.push(graphics);

            if (lastColor) {
                let graphics = this.add.graphics();
                graphics.fillStyle(lastColor);
                graphics.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
                this.backGrounds.push(graphics);
            }
        }

        if (this.backGrounds.length > 1) {
            this.backGrounds.reverse();

            let backgroundsLength = this.backGrounds.length;

            for (let i = 0; i < this.backGrounds.length; i++) {
                this.backGrounds[i].setDepth(backgroundsLength);
                backgroundsLength--;
            }

            this.setTween();
        }
    }

    setTween()
    {
        let tween = this.tweens.add({
            targets: this.backGrounds[0],
            alpha: 0,
            ease: 'Power1',
            duration: 6000,
            repeat: 0,
            onStart: () => {
            },
            onUpdate: () => {
            },
            onComplete: () => {
                let tempImage = this.backGrounds.shift();
                this.backGrounds.push(tempImage);

                let backgroundsLength = this.backGrounds.length;
                for (let i = 0; i < this.backGrounds.length; i++) {
                    this.backGrounds[i].setDepth(backgroundsLength);
                    backgroundsLength--;

                    if (i === this.backGrounds.length - 1) {
                        this.backGrounds[i].alpha = 1;
                    }
                }
                tween.remove();
                this.setTween();
                window.removeEventListener('focus', this.setFocus);
            }
        });

        window.addEventListener("focus", this.setFocus(tween));
    }

    setFocus(tween)
    {
        tween.restart();
        return tween;
    }

    renderSprites(type, y)
    {
        let sprites = [];
        let setPositions = this.setPositions(this.selectedItems[type].length);

        for (let i in this.selectedItems[type]) {
            let sprite = this.add.sprite(this.screenCenterX / 2.2,  y, this.selectedItems[type][i]);
            sprite.setDepth(999);
            sprites.push(sprite);
        }

        for (let i in setPositions) {
            sprites[i].setPosition(setPositions[i],  y);
        }
    }

    setPositions(numPoints) {
        let currentTry = 0;
        let newPosX;
        let setPositions = [];
        let triedPositions = [];
        let maxTries = 1000;

        while (setPositions.length < numPoints) {
            newPosX = this.setRandomPosX(triedPositions);

            for (let i = 0; i < setPositions.length; i++) {
                const diff = Math.abs(setPositions[i] - newPosX);

                if (diff < MINIMAL_DISTANCE && currentTry < maxTries) {
                    triedPositions.push(newPosX);
                    newPosX = this.setRandomPosX(triedPositions);
                    currentTry += 1;
                    i = -1;
                }
            }

            currentTry = 0;
            setPositions.push(newPosX);
        }

        return setPositions;
    }

    setRandomPosX(triedPositions) {
        let newPosX;
        let currentTry = 0;
        do {
            newPosX = Math.floor(Math.random() * (window.innerWidth / 1.1 - 40 + 1)) +40;
            currentTry++;
        } while (triedPositions.includes(newPosX) && currentTry < 5000)

        return newPosX;
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

    reset() {
        this.cameras.main.fadeOut(200, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            console.log(this.previousScene);
            this.scene.add(this.previousScene, {}, true)
        })
    }
}