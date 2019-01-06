export default {
    DOM_ELEMENT_ID: "canvas",
    LOCAL_STORAGE_MAX_SCORE_KEY: "flappy-bird.max-score",

    HEIGHT: 600,
    WIDTH: 800,

    // frames related config
    FPS: 60,
    UPDATE_INTERVAL: 1 / 60,

    // physics
    GRAVITY: 9.8,
    IMPULSE: 450,

    // player
    MAX_SPEED: 300,

    // obstacles
    PIPES: 10,
    PIPE_HEIGHT: 60,
    PIPE_SPEED: 300,
    PIPE_WIDTH: 100,
    PIPE_INTERVAL: 2000
};
