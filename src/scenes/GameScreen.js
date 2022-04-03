import Phaser from 'phaser'
import ItemSelector from "../gameObjects/ItemSelector";
import ItemPickingBoard from "../gameObjects/ItemPickingBoard";
import QrScanner from 'qr-scanner';
import {Html5QrcodeScanner} from "html5-qrcode";
let itemsJson = require('../items.json');
import {utils} from "../utils";
import RenderScreen from "./RenderScreen";
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
    constructor(handle = 'GameScreen')
    {
        super(handle)
        this.spaceKey = null;
        this.soundKeys = {};
        this.isGenerating = false;
        this.selectors = [];
        this.types = [];
        this.itemsNamesList = {};
        this.textureIndex = 0;
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
        this.load.audio('cuteBleeps', 'public/assets/items/annexSounds/Cute bleeps.mp3');
        this.load.audio('cuteBleeps2', 'public/assets/items/annexSounds/Cute bleeps2.mp3');
        this.load.audio('horn', 'public/assets/items/annexSounds/horn.mp3');
        this.load.audio('humans_horray', 'public/assets/items/annexSounds/Humans_Hooray_1.mp3');
        this.load.audio('rock', 'public/assets/items/annexSounds/mongroupederock.mp3');
        this.load.audio('mouthwoosh', 'public/assets/items/annexSounds/Mouth-woosh.mp3');
        this.load.audio('readout', 'public/assets/items/annexSounds/Readout_34.mp3');
        this.load.audio('snare', 'public/assets/items/annexSounds/SNARE.mp3');
        this.load.audio('twinkle', 'public/assets/items/annexSounds/Twinkle.mp3');
        this.load.audio('voyelle', 'public/assets/items/annexSounds/voyelle.mp3');

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
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.soundKeys['eightKey'] = {
            'input' : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.EIGHT),
            'sound' : 'cuteBleeps'
        };

        this.soundKeys.soundKeyssKey = {
            'input' : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            'sound' : 'cuteBleeps2'
        };
        this.soundKeys.twoKey = {
            'input' : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
            'sound' : 'horn',
        };

        this.soundKeys.zKey = {
            'input' : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
            'sound' : 'humans_horray',
        }

        this.soundKeys.iKey = {
            'input' : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I),
            'sound' : 'rock',
        }

        this.soundKeys.semiKey = {
            'input' : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEMICOLON),
            'sound' : 'mouthwoosh',
        }

        this.soundKeys.eightKeyBis = {
            'input' : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.EIGHT),
            'sound' : 'readout',
        }

        this.soundKeys.zeroKey = {
            'input' : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO),
            'sound' : 'snare',
        }

        this.soundKeys.oKey = {
            'input':  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O),
            'sound': 'twinkle'
        }

        this.soundKeys.bKey = {
            'input': this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B),
            'sound': 'voyelle'
        }

        for (let i in this.soundKeys) {
            let audio = this.sound.add(this.soundKeys[i]['sound']);

            this.soundKeys[i]['audio'] = audio;
            audio.loop = true;

            this.soundKeys[i]['input'].on('down', () => {
                if (true === audio.isPlaying) {
                    console.log('stop');
                    audio.pause();

                    return;
                }

                audio.play();
            })
        }

        this.setGenerateButton(screenCenterX);

        this.setPickingBoard(screenCenterX, screenCenterY, filter, 'back');
        this.setBoard(screenCenterX);
    }

    update(time, delta) {
        super.update(time, delta);

        if (this.spaceKey.isDown && false === this.isGenerating) {
            this.generate();
        }
    }

    init() {
        console.log(this.isGenerating);
    }

    setGenerateButton(screenCenterX)
    {
        let button = this.add.sprite(screenCenterX, 800, 'generateButton');
        button.setInteractive();
        button.on('pointerdown', () => {
            if (false === this.isGenerating) {
                this.generate();
            }
        })
    }

    generate() {
        this.isGenerating = true;
        for (let i in this.selectors) {
            if (null === this.selectors[i].itemId) {
                continue;
            }

            if (this.selectors[i].type in this.selectedItems) {
                this.selectedItems[this.selectors[i].type].push(this.selectors[i].itemId);
            }
        }

        this.sound.removeAll();
        this.cameras.main.fadeOut(200, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.stop();
            if (this.scene.get('RenderScreen' + utils.getPreviousRenderSceneIndex())) {
                this.scene.remove('RenderScreen' + utils.getPreviousRenderSceneIndex());
            }

            utils.incrementPreviousRenderSceneIndex();
            let key = 'RenderScreen' + utils.getPreviousRenderSceneIndex();
            let spawned = new RenderScreen(key);
            this.scene.add(key, spawned, true, {selectedItems: this.selectedItems, scene: 'GameScreen'});
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