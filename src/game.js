import Phaser from 'phaser';
import TitleScreen from './scenes/TitleScreen';
import GameScreen from "./scenes/GameScreen";

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 200}
        }
    },
    scene: [TitleScreen, GameScreen]
};


export default new Phaser.Game(config)