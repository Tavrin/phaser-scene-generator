import Phaser from 'phaser'

export default class ItemPickingBoard extends Phaser.GameObjects.Container {
    constructor(data) {
        let { scene, type, x , y, board, filter, itemsNames, back, next, previous} = data;
        let boardImage = new Phaser.GameObjects.Sprite(scene,0, 0, board);
        let backImage = new Phaser.GameObjects.Sprite(scene,0, 400, back);
        let nextItems = new Phaser.GameObjects.Sprite(scene,450, 0, next,);
        let previousItems = new Phaser.GameObjects.Sprite(scene,-450, 0, previous);
        backImage.setInteractive();
        boardImage.setInteractive();
        nextItems.setInteractive();
        previousItems.setInteractive();

        super(scene, x, y, [boardImage, backImage, nextItems, previousItems]);

        backImage.on('pointerdown', () => {
            this.hide();
        })

        this.backImage = backImage;
        this.nextItems = nextItems;
        this.previousItems = previousItems;
        this.currentPageIndex = 0;
        this.boardImage = boardImage;
        this.filter = filter;
        this.scene = scene;
        this.itemsNames = itemsNames;
        this.itemSelector = null;
        this.items = [];
        this.text = [];
        this.type = type;
        this.x = x;
        this.y = y;
        this.isOpen = false;
        scene.add.existing(this);
        this.addItems();
        this.setPagination();
        this.visible = this.isOpen;
    }

    show() {
        if (this.isOpen) {
            return;
        }

        this.scene.children.bringToTop(this.filter);
        this.filter.visible = true;
        this.scene.children.bringToTop(this);
        this.visible = this.isOpen = true;
    }

    hide() {
        if (!this.isOpen) {
            return;
        }

        this.filter.visible = false;
        this.visible = this.isOpen = false;
    }

    addItemSelector(itemSelector)
    {
        this.itemSelector = itemSelector;
    }

    addItems() {
        let posX, posY;
        let y = 0;

        for (let i = 0; i < this.itemsNames.length; i++) {
            if (0 === (i) % 20 || i === 0) {
                if (i !== 0) {
                    y ++;
                }

                this.items[y] = [];
                this.text[y] = [];
                posX = -230;
                posY = -145;
            } else if (0 === (i) % 5) {
                posY += 115;
                posX = -230;
            } else {
                posX += 115;
            }
            let sprite, text;

            if ( 'sound' === this.type) {
                sprite = new Phaser.GameObjects.Sprite(this.scene, posX, posY, 'itemZoneButton');
                text = new Phaser.GameObjects.BitmapText(this.scene, posX - 35, posY - 35, 'averta', this.itemsNames[i]['text'].substring(0, 50), 14);
                text.setDepth(8);
                text.maxWidth = 70;
                this.text[y].push(text);
                this.bringToTop(text);
            } else {
                sprite = new Phaser.GameObjects.Sprite(this.scene, posX, posY, this.itemsNames[i]);
            }

            sprite.setInteractive();
            sprite.on('pointerdown',() => {
                'sound' === this.type ? this.itemSelector.addItem(sprite, this.itemsNames[i]['selector'], this.itemsNames[i]['text'].substring(0, 50)) : this.itemSelector.addItem(sprite, this.itemsNames[i]);
                this.hide();
            })

            if (i >= 20) {
                sprite.setVisible(false);
                if ('sound' === this.type) {
                    text.setVisible(false)
                }
            }

            this.items[y].push(sprite);
        }

        for (let i = 0; i < this.items.length; i++) {
            this.add(this.items[i]);
        }

        if ('sound' === this.type) {
            for (let i = 0; i < this.text.length; i++) {
                this.add(this.text[i]);
            }
        }

        this.bringToTop(this.backImage);
    }

    setPagination() {
        this.previousItems.on('pointerdown', () => {
            this.changePage(false);
        })

        this.nextItems.on('pointerdown', () => {
            this.changePage();
        })

        this.previousItems.setVisible(false);

        if (this.items.length === 1) {
            this.nextItems.setVisible(false)
        }
    }

    changePage(isPageForward = true) {
        for (let i = 0; i <this.items[this.currentPageIndex].length; i++) {
            this.items[this.currentPageIndex][i].setVisible(false);
            if ('sound' === this.type) {
                this.text[this.currentPageIndex][i].setVisible(false);
            }
        }

        isPageForward ? this.currentPageIndex ++ : this.currentPageIndex --;
        this.currentPageIndex <= 0 ? this.previousItems.setVisible(false) : this.previousItems.setVisible(true);
        this.currentPageIndex >= this.items.length - 1 ? this.nextItems.setVisible(false) : this.nextItems.setVisible(true);

        for (let i = 0; i <this.items[this.currentPageIndex].length; i++) {
            this.items[this.currentPageIndex][i].setVisible(true);

            if ('sound' === this.type) {
                this.text[this.currentPageIndex][i].setVisible(true);
            }
        }
    }
}
