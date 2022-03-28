import Phaser from 'phaser'
import ItemSelector from "../gameObjects/ItemSelector";
import ItemPickingBoard from "../gameObjects/ItemPickingBoard";
import QrScanner from 'qr-scanner';
import {Html5QrcodeScanner} from "html5-qrcode";
import ItemSelectorQrMode from "../gameObjects/ItemSelectorQrMode";
let itemsJson = require('../items.json');

const centerWidth = window.innerWidth / 2;
const centerHeight = window.innerHeight / 2;
const PICK_BOARDS = [
    'boardImageBackground',
    'boardImageBack',
    'boardImageFront',
    'boardImageSound',
]

    export default class GameScreenQrMode extends Phaser.Scene
{
    constructor()
    {
        super('GameScreenQrMode')
        this.selectors = [];
        this.types = [];
        this.itemsNamesList = {};
        this.qrCodeIds = [];

        this.pickingBoards = [];
        this.selectedItems = {};

        for (let type in itemsJson) {
            this.itemsNamesList[type] = [];
            this.selectedItems[type] = [];
            this.types.push(type);

            for (let i in itemsJson[type].items) {
                if (type === 'sound') {
                    let text = decodeURIComponent(escape(itemsJson[type].items[i]['selector'].text));
                    let soundData = {
                        'selector': itemsJson[type].items[i]['selector'].name,
                        'text': text
                    };
                    this.itemsNamesList[type].push(soundData);
                    continue;
                }

                this.itemsNamesList[type].push(itemsJson[type].items[i]['selector'].name);
            }
        }
    }

    preload()
    {
        this.load.bitmapFont('averta', 'public/assets/font/averta_0.png', 'public/assets/font/averta.xml');
        this.load.image('bgc2', 'public/assets/img/backgroundv2.jpg');
        this.load.image('addItemButton', 'public/assets/img/buttonAjout.png');
        this.load.image('itemZoneButton', 'public/assets/img/itemZone.png');
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
        this.load.audio('audioDebut', 'public/assets/items/sound/sound1.wav');

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
        this.setBoard(screenCenterX);

        let video = this.add.video(1600, 400, 'testvideo');
        this.startup(video);
    }

    startup(video) {
        navigator.mediaDevices.getUserMedia({video: true, audio: false})
            .then((stream) => {
                video.loadMediaStream(stream, 'canplay');
                video.scale = 0.5;
                video.play();
                console.log(video.video);

                const scanner = new QrScanner(video.video, (result) => {this.addQrCodeId(result)}, {
                    onDecodeError: error => {
                       console.log(error);
                    },
                    highlightScanRegion: true,
                    highlightCodeOutline: true,
                });

                video.video.width = 400;
                video.video.height = 400;

                scanner.start().then(r => console.log(r));
            })
            .catch(function(err) {
                console.log("An error occurred: " + err);
            });
    }

    addQrCodeId(result) {
        if (this.qrCodeIds.includes(result.data)) {
            return null;
        }

        this.qrCodeIds.push(result.data)
        console.log(this.qrCodeIds);
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

    setBoard(screenCenterX)
    {
        let currentItemX = screenCenterX / 1.5;
        let currentItemY = 150;
        let currentTypeIndex = 0;
        let soundIndex = 0;

        for (let i = 0; i < 35 ; i++) {
            let itemSelector = new ItemSelectorQrMode({
                scene : this,
                x: currentItemX,
                y: currentItemY,
                image : 'addItemButton',
                type : this.types[currentTypeIndex],
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
                if (y === 'sound') {
                    continue;
                }

                const item = itemsJson[this.types[y]].items[i];
                this.load.image(item['selector'].name, item['selector'].file);
            }
        }

    }

    loadSounds()
    {
    }
}