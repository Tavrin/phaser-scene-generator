import Phaser from 'phaser'
import QrScanner from 'qr-scanner';
import ItemSelectorQrMode from "../gameObjects/ItemSelectorQrMode";
import game from "../game";

let itemsJson = require('../items.json');

const TOTAL_BOARD_ITEMS = 20;

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
    constructor(handle = 'GameScreenQrMode')
    {
        super(handle)
        console.log("test");

        this.spaceKey = null;
        this.isGenerating = false;
        this.selectors = [];
        this.types = [];
        this.itemsNamesList = {};
        this.qrCodeIds = [];
        this.textureId = 0;

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
        //this.load.audio('audioDebut', 'public/assets/items/sound/sound1.wav');

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
        this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        this.setGenerateButton(screenCenterX);
        this.setBoard(screenCenterX);

        let video = this.add.video(1600, 400, 'testvideo');
        this.startup(video);
    }

    update(time, delta) {
        super.update(time, delta);

        if (this.spaceKey.isDown && false === this.isGenerating) {
            this.generate();
        }
    }

    startup(video) {
        navigator.mediaDevices.enumerateDevices().then((mediaInfo) =>
        {
            let cameraId = 'bb1c0f8d2e454bda29b46f0b986abf6ec457a925bb63a2d3a18265487d586f24';
            console.log(mediaInfo);
            for (let i in mediaInfo) {
                if ('Logitech BRIO (046d:085e)' === mediaInfo[i].label) {
                    cameraId = mediaInfo[i].deviceId;
                    break;
                }
            }
            navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: cameraId,
                },
                audio: false
            })
                .then((stream) => {
                    video.loadMediaStream(stream, 'canplay');
                    console.log(video.height);
                    video.scale = 0.5;
                    video.play();

                    this.input.keyboard.on('keydown-E', (event) => {
                        for (let i in this.selectors) {
                            this.selectors[i].clear();
                        }

                        this.qrCodeIds = [];
                        this.images = [];
                        let cropX = 0;
                        let cropY = 0;

                        this.testScanCode(video);
                    });
                })
                .catch(function (err) {
                    console.log("An error occurred: " + err);
                })
        });
    }

    testScanCode(video, i = 0, cropX = 0, cropY = 0) {
        if (i === TOTAL_BOARD_ITEMS) {
            this.addQrCodeIds()
            return;
        }

        let snapshot = video.snapshotArea(cropX, cropY, 120, 120);

        this.load.textureManager.addCanvas('snapshot'+this.textureId, snapshot.canvas);

        this.selectors[i].addQrImage('snapshot'+this.textureId);
        let image = this.load.textureManager.get(this.selectors[i].texture.key);

        cropX += 130;

        if (0 === (i + 1) % 5 && 15 >= i) {
            cropX = 0;
            cropY += 130;
        }

        this.textureId ++;

        QrScanner.scanImage(this.selectors[i].texture.getCanvas(), {
            returnDetailedScanResult : true,
            alsoTryWithoutScanRegion : true,
        })
            .then(result => {
                this.qrCodeIds.push(result.data);
                console.log(result)
                this.selectors[i].tint = 0x58ff21;
                if (i < TOTAL_BOARD_ITEMS) {
                    this.testScanCode(video, i+= 1, cropX, cropY)
                }
            })
            .catch(error => {
                this.selectors[i].tint = 0xff0000;
                //console.log(error || 'No QR code found.')
                if (i < TOTAL_BOARD_ITEMS) {
                    //console.log(i);
                    this.testScanCode(video, i += 1, cropX, cropY)
                }
            });
    }

    addQrCodeIds() {
        for (let x in this.qrCodeIds) {
            firstLoop:
                for (let y in this.types) {
                    for (let i in itemsJson[this.types[y]].items) {
                        const item = itemsJson[this.types[y]].items[i];

                        if (!item['item'].name || this.qrCodeIds[x] !== item['item'].name) {
                            continue;
                        }

                        for (let u in this.selectors) {
                            this.selectors[u].clearTint();

                            if (null !== this.selectors[u].itemId) {
                                continue;
                            } else if(this.selectors[u].type !== this.types[y]) {
                                this.selectors[u].clear();
                                continue;
                            }

                            let text = item['selector'].text ?? null;
                            let selector = item['selector'].name;
                            console.log(selector);
                            this.selectors[u].addItem(selector, text);

                            break firstLoop;
                        }
                    }
            }
        }

        for (let i in this.selectors) {
            if (null === this.selectors[i].itemId) {
                this.selectors[i].clear();
            }
        }

            console.log(this.qrCodeIds);
    }

    setGenerateButton(screenCenterX)
    {
        let button = this.add.sprite(screenCenterX, 800, 'generateButton');
        button.setInteractive();
        button.on('pointerdown', () => {
            if (false === this.isGenerating) {
                this.generate();
            }        })
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

        this.cameras.main.fadeOut(200, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.stop();
            this.scene.start('RenderScreen', {selectedItems: this.selectedItems, scene : 'GameScreenQrMode'});
        })
    }

    setBoard(screenCenterX)
    {
        let currentItemX = screenCenterX / 1.5;
        let currentItemY = 150;
        let currentTypeIndex = 0;
        let soundIndex = 0;

        for (let i = 0; i < TOTAL_BOARD_ITEMS ; i++) {
            let itemSelector = new ItemSelectorQrMode({
                scene : this,
                x: currentItemX,
                y: currentItemY,
                image : 'addItemButton',
                type : this.types[currentTypeIndex],
            })

            currentItemX += 150;

            if (0 === (i + 1) % 5 && 15 >= i) {
                currentTypeIndex++;
                currentItemX = screenCenterX / 1.5, currentItemY += 150;
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