import Phaser from 'phaser'
import ItemSelector from "../gameObjects/ItemSelector";
import ItemPickingBoard from "../gameObjects/ItemPickingBoard";

const centerWidth = window.innerWidth / 2;
const centerHeight = window.innerHeight / 2;
const FRONT_TYPE = 'front';
const BACK_TYPE = 'back';
const TOTAL_BACK_TYPE = 'background';
const SOUND_TYPE = 'sound';
const PICK_BOARDS = [
    'boardImageBackground',
    'boardImageBack',
    'boardImageFront',
    'boardImageSound',
]
const FRONT_ITEMS = [
    'front1',
    'front2',
    'front3',
    'front4',
    'front5',
    'front6',
    'front7',
    'front8',
    'front9',
    'front10',
    'front11',
    'front12',
    'front13',
    'front14',
    'front15',
    'front16',
    'front17',
    'front18',
    'front19',
    'front20',
];

const SOUND_ITEMS = [
    'front1',
    'front2',
    'front3',
    'front4',
    'front5',
    'front6',
    'front7',
    'front8',
    'front9',
    'front10',
    'front11',
    'front12',
    'front13',
    'front14',
    'front15',
    'front16',
    'front17',
    'front18',
    'front19',
    'front20',
];

const BACK_ITEMS = [
    'back1',
    'back2',
    'back3',
    'back4',
    'back5',
    'back6',
    'back7',
    'back8',
    'back9',
    'back10',
    'back11',
    'back12',
    'back13',
    'back14',
    'back15',
    'back16',
    'back17',
    'back18',
    'back19',
    'back20',
];

const BACKGROUND_ITEMS = [
    'back1',
    'back2',
    'back3',
    'back4',
    'back5',
    'back6',
    'back7',
    'back8',
    'back9',
    'back10',
    'back11',
    'back12',
    'back13',
    'back14',
    'back15',
    'back16',
    'back17',
    'back18',
    'back19',
    'back20',
];

export default class GameScreen extends Phaser.Scene
{
    constructor()
    {
        super('GameScreen')
        this.selectors = [];
        this.types = [TOTAL_BACK_TYPE, BACK_TYPE, FRONT_TYPE, SOUND_TYPE];
        this.itemsNamesList = {
            [TOTAL_BACK_TYPE]: BACKGROUND_ITEMS,
            [BACK_TYPE]: BACK_ITEMS,
            [FRONT_TYPE]: FRONT_ITEMS,
            [SOUND_TYPE]: SOUND_ITEMS,
        }
        this.pickingBoards = [];
        this.selectedItems = {
            [TOTAL_BACK_TYPE]: [],
            [BACK_TYPE]: [],
            [FRONT_TYPE]: [],
            [SOUND_TYPE]: []
        }
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
        this.load.image(PICK_BOARDS[0], 'public/assets/img/pickboard-background.png');
        this.load.image(PICK_BOARDS[1], 'public/assets/img/pickboard-back.png');
        this.load.image(PICK_BOARDS[2], 'public/assets/img/pickboard-front.png');
        this.load.image(PICK_BOARDS[3], 'public/assets/img/pickboard-sound.png');
        this.load.image('back', 'public/assets/img/retour.png');

        this.loadFrontImages();
        this.loadBackImages();
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

            console.log(this.selectedItems);
        })
    }

    setPickingBoard(screenCenterX, screenCenterY, filter, backImage)
    {
        for (let i = 0; i < this.types.length; i++) {
            console.log(this.itemsNamesList);
            for (let y = 0; y < 5; y++) {
                let pickingBoard = new ItemPickingBoard({
                    scene: this,
                    type: this.types[i],
                    x: screenCenterX,
                    y: screenCenterY / 1.3,
                    board: PICK_BOARDS[i],
                    filter: filter,
                    back: backImage,
                    itemsNames: this.itemsNamesList[this.types[i]]
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
        console.log(this.pickingBoards)

        for (let i = 0; i < 20 ; i++) {
            this.selectors.push(
                new ItemSelector({
                    scene : this,
                    x: currentItemX,
                    y: currentItemY,
                    image : 'addItemButton',
                    type : this.types[currentTypeIndex],
                    pickingBoard : this.pickingBoards[i],
                })
            )

            currentItemX += 150;

            if (0 === (i + 1) % 5) {
                currentTypeIndex++;
                currentItemY += 150;
                currentItemX = screenCenterX / 1.5;
            }
        }
    }

    loadFrontImages()
    {
        this.load.image(FRONT_ITEMS[0], 'public/assets/img/items/front/front1.png');
        this.load.image(FRONT_ITEMS[1], 'public/assets/img/items/front/front2.png');
        this.load.image(FRONT_ITEMS[2], 'public/assets/img/items/front/front1.png');
        this.load.image(FRONT_ITEMS[3], 'public/assets/img/items/front/front2.png');
        this.load.image(FRONT_ITEMS[4], 'public/assets/img/items/front/front1.png');
        this.load.image(FRONT_ITEMS[5], 'public/assets/img/items/front/front2.png');
        this.load.image(FRONT_ITEMS[6], 'public/assets/img/items/front/front1.png');
        this.load.image(FRONT_ITEMS[7], 'public/assets/img/items/front/front2.png');
        this.load.image(FRONT_ITEMS[8], 'public/assets/img/items/front/front1.png');
        this.load.image(FRONT_ITEMS[9], 'public/assets/img/items/front/front2.png');
        this.load.image(FRONT_ITEMS[10], 'public/assets/img/items/front/front1.png');
        this.load.image(FRONT_ITEMS[11], 'public/assets/img/items/front/front2.png');
        this.load.image(FRONT_ITEMS[12], 'public/assets/img/items/front/front1.png');
        this.load.image(FRONT_ITEMS[13], 'public/assets/img/items/front/front2.png');
        this.load.image(FRONT_ITEMS[14], 'public/assets/img/items/front/front1.png');
        this.load.image(FRONT_ITEMS[15], 'public/assets/img/items/front/front2.png');
        this.load.image(FRONT_ITEMS[16], 'public/assets/img/items/front/front1.png');
        this.load.image(FRONT_ITEMS[17], 'public/assets/img/items/front/front2.png');
        this.load.image(FRONT_ITEMS[18], 'public/assets/img/items/front/front1.png');
        this.load.image(FRONT_ITEMS[19], 'public/assets/img/items/front/front2.png');
    }

    loadBackImages()
    {
        this.load.image(BACK_ITEMS[0], 'public/assets/img/items/back/back1.png');
        this.load.image(BACK_ITEMS[1], 'public/assets/img/items/back/back2.png');
        this.load.image(BACK_ITEMS[2], 'public/assets/img/items/back/back3.png');
        this.load.image(BACK_ITEMS[3], 'public/assets/img/items/back/back4.png');
        this.load.image(BACK_ITEMS[4], 'public/assets/img/items/back/back5.png');
        this.load.image(BACK_ITEMS[5], 'public/assets/img/items/back/back1.png');
        this.load.image(BACK_ITEMS[6], 'public/assets/img/items/back/back2.png');
        this.load.image(BACK_ITEMS[7], 'public/assets/img/items/back/back3.png');
        this.load.image(BACK_ITEMS[8], 'public/assets/img/items/back/back4.png');
        this.load.image(BACK_ITEMS[9], 'public/assets/img/items/back/back5.png');
        this.load.image(BACK_ITEMS[10], 'public/assets/img/items/back/back1.png');
        this.load.image(BACK_ITEMS[11], 'public/assets/img/items/back/back2.png');
        this.load.image(BACK_ITEMS[12], 'public/assets/img/items/back/back3.png');
        this.load.image(BACK_ITEMS[13], 'public/assets/img/items/back/back4.png');
        this.load.image(BACK_ITEMS[14], 'public/assets/img/items/back/back5.png');
        this.load.image(BACK_ITEMS[15], 'public/assets/img/items/back/back1.png');
        this.load.image(BACK_ITEMS[16], 'public/assets/img/items/back/back2.png');
        this.load.image(BACK_ITEMS[17], 'public/assets/img/items/back/back3.png');
        this.load.image(BACK_ITEMS[18], 'public/assets/img/items/back/back4.png');
        this.load.image(BACK_ITEMS[19], 'public/assets/img/items/back/back5.png');
    }
}