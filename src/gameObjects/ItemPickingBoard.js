import Phaser from 'phaser'

export default class ItemPickingBoard extends Phaser.GameObjects.Container {
    constructor(data) {
        let { scene, type, x , y, board, filter, itemsNames, back} = data;
        let boardImage = new Phaser.GameObjects.Sprite(scene,0, 0, board);
        let backImage = new Phaser.GameObjects.Sprite(scene, 0, 385, back);
        backImage.setInteractive();
        boardImage.setInteractive();
        super(scene, x, y, [boardImage, backImage]);

        backImage.on('pointerdown', () => {
            this.hide();
        })

        this.backImage = backImage;
        this.boardImage = boardImage;
        this.filter = filter;
        this.scene = scene;
        this.itemsNames = itemsNames;
        this.itemSelector = null;
        this.items = [];
        this.type = type;
        this.x = x;
        this.y = y;
        this.isOpen = false;
        scene.add.existing(this);
        this.addItems();
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

    hideBackgroundBoard()
    {
        this.scene.add.sprite()
    }

    addItems()
    {
        let posX = -230;
        let posY = -145;
        let currentIndex = 0;

        for (let i = 0; i < this.itemsNames.length; i++) {
            let sprite = new Phaser.GameObjects.Sprite(this.scene, posX, posY, this.itemsNames[i]);
            sprite.setInteractive();
            sprite.on('pointerdown',() => {
                this.itemSelector.addItem(sprite, this.itemsNames[i]);
                this.hide();
            })

            this.items.push(sprite);

            posX += 115;

            if (0 === (i + 1) % 5) {
                currentIndex++;
                posY += 115;
                posX = -230;
            }
        }

        this.add(this.items);

        this.bringToTop(this.backImage);
    }
}
