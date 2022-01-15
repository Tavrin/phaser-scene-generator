import Phaser from 'phaser'

export default class Item extends Phaser.GameObjects.Sprite {
    constructor(data) {
        let { scene, x, y, image, type, name, pickingBoard} = data;
        super(scene, x, y, image);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.image = image;
        this.name = name;
        this.type = type;
        this.pickingBoard = pickingBoard;

        this.setInteractive();

        scene.add.existing(this);
    }
}
