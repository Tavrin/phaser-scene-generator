import Phaser from 'phaser'

export default class ItemSelector extends Phaser.GameObjects.Sprite {
    constructor(data) {
        let { scene, x, y, image, type, pickingBoard} = data;
        super(scene, x, y, image);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.image = image;
        this.type = type;
        this.text = null;
        this.pickingBoard = pickingBoard;
        this.itemSprite = null;
        this.itemId = null;

        this.pickingBoard.addItemSelector(this);

        this.setInteractive();

        this.on('pointerdown', (pointer) => {
            this.pickingBoard.show();
        })

        scene.add.existing(this);
    }

    addItem(sprite, itemName, text = null) {
        this.itemSprite = sprite;
        this.itemId = itemName;
        if ('sound' === this.type) {
            this.setTexture('itemZoneButton');
            if (text) {
                this.text = this.scene.add.bitmapText(this.x - 15, this.y - 20, 'averta', text, 10);
                this.text.maxWidth = 50;
            }
        } else {
            this.setTexture(this.itemId);
        }
    }
}
