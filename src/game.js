import Phaser from 'phaser';
import TitleScreen from './scenes/TitleScreen';
import GameScreen from "./scenes/GameScreen";
import RenderScreen from "./scenes/RenderScreen";

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [TitleScreen, GameScreen, RenderScreen]
};


export default new Phaser.Game(config)