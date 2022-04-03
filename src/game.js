import Phaser from 'phaser';
import GameScreen from "./scenes/GameScreen";
import RenderScreen from "./scenes/RenderScreen";

const config = {
    type: Phaser.AUTO,
    mode: Phaser.Scale.FIT,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [GameScreen, RenderScreen]
};

let game = new Phaser.Game(config)

    window.addEventListener('resize', () => {
        game.scale.resize(window.innerWidth, window.innerHeight);
    });

export default game