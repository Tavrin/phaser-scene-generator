import Phaser from 'phaser'
import ItemSelector from "../gameObjects/ItemSelector";
import ItemPickingBoard from "../gameObjects/ItemPickingBoard";
const itemsJson= require('../items.json');

const centerWidth = window.innerWidth / 2;
const centerHeight = window.innerHeight / 2;
const PICK_BOARDS = [
    'boardImageBackground',
    'boardImageBack',
    'boardImageFront',
    'boardImageSound',
]

    export default class GameScreen extends Phaser.Scene
{
    constructor()
    {
        super('GameScreen')
        this.selectors = [];
        this.types = [];
        this.itemsNamesList = {};

        this.pickingBoards = [];
        this.selectedItems = {};

        for (let type in itemsJson) {
            this.itemsNamesList[type] = [];
            this.selectedItems[type] = [];
            this.types.push(type);

            for (let i in itemsJson[type].items) {
                this.itemsNamesList[type].push(itemsJson[type].items[i]['selector'].name);
            }
        }

        console.log(this.itemsNamesList);
    }

    preload()
    {
        this.load.image('bgc2', 'public/assets/img/backgroundv2.jpg');
        this.load.image('addItemButton', 'public/assets/img/buttonAjout.png');
        this.load.image('generateButton', 'public/assets/img/generate.png');
        this.load.image('labelSon', 'public/assets/img/label-sons.png');
        this.load.image('labelBackground', 'public/assets/img/label-background.png');
        this.load.image('labelFront', 'public/assets/img/label-front.png');
        this.load.image('labelBack', 'public/assets/img/label-back.png');
        this.load.image('blackFilter', 'public/assets/img/filter.png');
        this.load.image('nextItemsPage', 'public/assets/img/next.png');
        this.load.image('previousItemsPage', 'public/assets/img/previous.png');
        this.load.image(PICK_BOARDS[0], 'public/assets/img/pickboard-background.png');
        this.load.image(PICK_BOARDS[1], 'public/assets/img/pickboard-back.png');
        this.load.image(PICK_BOARDS[2], 'public/assets/img/pickboard-front.png');
        this.load.image(PICK_BOARDS[3], 'public/assets/img/pickboard-sound.png');
        this.load.image('back', 'public/assets/img/retour.png');

        this.loadItems();
    }

    create()
    {
        this.cameras.main.fadeIn(400, 0, 0, 0);
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        this.add.image(centerWidth, centerHeight, 'bgc2');

        let filter = this.add.image(centerWidth, centerHeight, 'blackFilter').setInteractive();
        filter.alpha = 0.9;
        filter.visible = false;

        this.add.sprite(screenCenterX / 2.2, 610, 'labelSon');
        this.add.sprite(screenCenterX / 2.2, 460, 'labelFront');
        this.add.sprite(screenCenterX / 2.2, 310, 'labelBack');
        this.add.sprite(screenCenterX / 2.2, 160, 'labelBackground');

        this.setGenerateButton(screenCenterX);

        this.setPickingBoard(screenCenterX, screenCenterY, filter, 'back');
        this.setBoard(screenCenterX);
    }

    setGenerateButton(screenCenterX)
    {
        let button = this.add.sprite(screenCenterX, 800, 'generateButton');
        button.setInteractive();
        button.on('pointerdown', () => {
            for (let i in this.selectors) {
                if (null === this.selectors[i].itemId) {
                    continue;
                }

                if (this.selectors[i].type in this.selectedItems) {
                    this.selectedItems[this.selectors[i].type].push(this.selectors[i].itemId);
                }
            }

            this.cameras.main.fadeOut(200, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                this.scene.start('RenderScreen', {selectedItems: this.selectedItems});
            })
        })
    }

    setPickingBoard(screenCenterX, screenCenterY, filter, backImage)
    {
        for (let i = 0; i < this.types.length; i++) {
            for (let y = 0; 'sound' === this.types[i] ? y < 20 : y < 5; y++) {
                let pickingBoard = new ItemPickingBoard({
                    scene: this,
                    type: this.types[i],
                    x: screenCenterX,
                    y: screenCenterY / 1.3,
                    board: PICK_BOARDS[i],
                    filter: filter,
                    back: backImage,
                    itemsNames: this.itemsNamesList[this.types[i]],
                    next: 'nextItemsPage',
                    previous: 'previousItemsPage',
                })

                this.pickingBoards.push(pickingBoard);
            }
        }
    }

    setBoard(screenCenterX)
    {
        let currentItemX = screenCenterX / 1.5;
        let currentItemY = 150;
        let currentTypeIndex = 0;
        let soundIndex = 0;

        for (let i = 0; i < 35 ; i++) {
            let itemSelector = new ItemSelector({
                scene : this,
                x: currentItemX,
                y: currentItemY,
                image : 'addItemButton',
                type : this.types[currentTypeIndex],
                pickingBoard : this.pickingBoards[i],
            })

            if (i < 15) {
                currentItemX += 150;
            }

            if ('sound' === this.types[currentTypeIndex]) {
                if (0 === (soundIndex + 1) % 5 && 0 !== (soundIndex + 1) % 10) {
                    currentItemX += 100;
                } else if (0 === (soundIndex + 1) % 10) {
                    currentItemY += 70;
                    currentItemX = screenCenterX / 1.6;
                } else {
                    currentItemX += 70;
                }

                itemSelector.setScale(0.5, 0.5);
                soundIndex += 1;
            }

            if (0 === (i + 1) % 5 && 15 >= i) {
                currentTypeIndex++;
                'sound' === this.types[currentTypeIndex] ? (currentItemX = screenCenterX / 1.6, currentItemY += 130) : (currentItemX = screenCenterX / 1.5, currentItemY += 150);
            }

            this.selectors.push(itemSelector)
        }
    }

    loadItems()
    {
        for (let y in this.types) {
            for (let i in itemsJson[this.types[y]].items) {
                const item = itemsJson[this.types[y]].items[i];
                this.load.image(item['selector'].name, item['selector'].file);
            }
        }

    }

    loadSounds()
    {
    }
}