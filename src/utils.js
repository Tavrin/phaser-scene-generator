const utils = {};

let previousSceneIndex = 0;
let previousRenderSceneIndex = 0;

utils.getPreviousSceneIndex = () => {
    return previousSceneIndex;
};

utils.incrementPreviousSceneIndex = () => {
    previousSceneIndex += 1;
}

utils.getPreviousRenderSceneIndex = () => {
    return previousRenderSceneIndex;
};

utils.incrementPreviousRenderSceneIndex = () => {
    previousRenderSceneIndex += 1;
}

export {utils};