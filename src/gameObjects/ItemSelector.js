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

    addItem(sprite, itemName)
    {
        this.itemSprite = sprite;
        this.itemId = itemName;
        this.setTexture(this.itemId);
    }
}
