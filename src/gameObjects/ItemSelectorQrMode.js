import Phaser from 'phaser'

export default class ItemSelectorQrMode extends Phaser.GameObjects.Sprite {
    constructor(data) {
        let { scene, x, y, image, type} = data;
        super(scene, x, y, image);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.image = image;
        this.type = type;
        this.qrId = 0;
        this.text = null;
        this.itemSprite = null;
        this.itemId = null;

        this.setInteractive();

        scene.add.existing(this);
    }

    addItem(itemName, text = null) {
        this.itemId = itemName;
        if ('sound' === this.type) {
            this.setTexture('itemZoneButton');
            if (text) {
                this.text = this.scene.add.bitmapText(this.x - 15, this.y - 20, 'averta', text, 10);
                this.text.maxWidth = 50;
            }
        } else {
            console.log(this.itemId);
            this.setTexture(this.itemId);
        }
    }

    clear() {
        this.itemId = null;
        this.setTexture('addItemButton');
        this.clearTint();
    }

    addQrImage(qrName) {
        this.qrId = qrName;
        this.setTexture(this.qrId);
    }
}
