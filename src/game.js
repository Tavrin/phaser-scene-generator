import Phaser from 'phaser';
import GameScreenQrMode from "./scenes/GameScreenQrMode";
import RenderScreen from "./scenes/RenderScreen";

const config = {
    type: Phaser.AUTO,
    mode: Phaser.Scale.FIT,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [GameScreenQrMode, RenderScreen]
};

let game = new Phaser.Game(config)

    window.addEventListener('resize', () => {
        game.scale.resize(window.innerWidth, window.innerHeight);
    });

export default game