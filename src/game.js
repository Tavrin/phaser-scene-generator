import Phaser from 'phaser';
import TitleScreen from './scenes/TitleScreen';
import GameScreen from "./scenes/GameScreen";
import GameScreenQrMode from "./scenes/GameScreenQrMode";
import RenderScreen from "./scenes/RenderScreen";

const config = {
    type: Phaser.AUTO,
    mode: Phaser.Scale.FIT,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [TitleScreen, GameScreen, GameScreenQrMode, RenderScreen]
};

let game = new Phaser.Game(config)

    window.addEventListener('resize', () => {
        game.scale.resize(window.innerWidth, window.innerHeight);
    });

export default game