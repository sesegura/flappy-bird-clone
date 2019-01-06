const CONFIG = {
    DOM_ELEMENT_ID: "canvas",

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

const KEYS = {
    SPACE: 32
};

function Player() {
    const height = (width = 50);

    const initialPlayerX = 50;
    const initialPlayerY = CONFIG.HEIGHT / 2 - height / 2;

    return {
        x: initialPlayerX,
        y: initialPlayerY,

        acceleration: 0,
        speed: 0,

        maxSpeed: CONFIG.MAX_SPEED,

        height,
        width,

        isJumping: false,

        isGravityActive: false,

        _isAlive: true,

        isAlive() {
            // out of top boundary
            if (this.y + this.height <= 0) {
                return false;
            }

            // out of bottom boundary
            if (this.y > CONFIG.HEIGHT) {
                return false;
            }

            return this._isAlive;
        },

        setIsAlive(value) {
            this._isAlive = value;
        },

        toggleGravity() {
            this.isGravityActive = true;
        },

        onFlap() {
            this.isJumping = true;
        },

        update() {
            if (!this.isGravityActive) {
                return;
            }

            this.acceleration = CONFIG.GRAVITY;

            if (this.isJumping) {
                this.acceleration -= CONFIG.IMPULSE;
            }

            let speed =
                this.speed +
                this.acceleration +
                this.acceleration * CONFIG.UPDATE_INTERVAL;

            this.speed = Math.max(
                -this.maxSpeed,
                Math.min(this.maxSpeed, speed)
            );

            this.y += this.speed * CONFIG.UPDATE_INTERVAL;
        },

        draw(ctx) {
            if (!this.isAlive()) {
                return;
            }

            ctx.fillRect(this.x, this.y, this.width, this.height);

            this.isJumping = false;
        },

        getRect() {
            return {
                top: this.y,
                left: this.x,
                bottom: this.y + this.height,
                right: this.x + this.width
            };
        }
    };
}

function Pipe() {
    return {
        x: CONFIG.WIDTH,

        topSection: null,
        bottomSection: null,

        width: CONFIG.PIPE_WIDTH,

        _isActive: false,

        init() {
            const top = Math.floor(Math.random() * (CONFIG.PIPES - 4) + 2);

            this.topSection = CONFIG.PIPE_HEIGHT * top;
            this.bottomSection = CONFIG.PIPE_HEIGHT * (CONFIG.PIPES - top - 2);

            this._isActive = true;
        },

        isActive() {
            return this._isActive;
        },

        isVisibleToPlayer() {
            return this.x + this.width >= 0;
        },

        update() {
            this.x -= CONFIG.PIPE_SPEED * CONFIG.UPDATE_INTERVAL;
        },

        draw(ctx) {
            if (!this.isActive() || !this.isVisibleToPlayer()) {
                return;
            }

            this._drawTopPipe(ctx);
            this._drawBottomPipe(ctx);
        },

        _drawTopPipe(ctx) {
            ctx.fillRect(this.x, 0, this.width, this.topSection);
        },

        _drawBottomPipe(ctx) {
            ctx.fillRect(
                this.x,
                this.topSection + CONFIG.PIPE_HEIGHT * 2,
                this.width,
                this.bottomSection
            );
        },

        getRect() {
            return {
                left: this.x,
                right: this.x + this.width,
                topSection: {
                    top: 0,
                    bottom: this.topSection
                },
                bottomSection: {
                    top: CONFIG.HEIGHT - this.bottomSection,
                    bottom: CONFIG.HEIGHT
                }
            };
        }
    };
}

function Game() {
    const canvas = document.getElementById(CONFIG.DOM_ELEMENT_ID);
    const ctx = canvas.getContext("2d");

    return {
        // -------- Game properties -------- //

        canvas,
        ctx,

        isPlaying: false,

        player: null,
        pipes: [],

        score: 0,
        maxScore: 0,
        newRecord: false,

        onPlayHandler: null,
        onKeyPressedHandler: null,

        addPipeInterval: null,

        // -------- Methods -------- //

        setup() {
            this.score = 0;
            this.newRecord = false;

            this.player = new Player();
            this.pipes = [];

            this.onPlayHandler = this.onPlayHandler
                ? this.onPlayHandler
                : this.play.bind(this);

            this.canvas.removeEventListener("click", this.onPlayHandler);
            this.canvas.addEventListener("click", this.onPlayHandler);

            this.onKeyPressedHandler = this.onKeyPressedHandler
                ? this.onKeyPressedHandler
                : this.onKeyPressed.bind(this);

            window.removeEventListener("keypress", this.onKeyPressedHandler);
            window.addEventListener("keypress", this.onKeyPressedHandler);
        },

        clear() {
            this.ctx.clearRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
        },

        play() {
            if (!this.player.isAlive()) {
                return this.setup();
            }

            this.isPlaying = true;
            this.player.toggleGravity();

            clearInterval(this.addPipeInterval);
            this.addPipeInterval = setInterval(
                this.addPipe.bind(this),
                CONFIG.PIPE_INTERVAL
            );
        },

        addPipe() {
            const pipe = new Pipe();
            this.pipes.push(pipe);
            pipe.init();
        },

        drawScore() {
            this.ctx.font = "20px Arial";

            if (this.isPlaying) {
                if (this.newRecord) {
                    this.ctx.fillText(`NEW RECORD!!`, 20, 30);
                }

                this.ctx.fillText(
                    `Score: ${this.score}`,
                    CONFIG.WIDTH - 100,
                    30
                );
            }

            if (!this.player.isAlive()) {
                this.ctx.fillText(
                    "GAME OVER",
                    CONFIG.WIDTH / 2 - 60,
                    CONFIG.HEIGHT / 2
                );

                this.ctx.font = "13px Arial";
                this.ctx.fillText(
                    `MAX SCORE: ${this.maxScore}`,
                    CONFIG.WIDTH / 2 - 45,
                    CONFIG.HEIGHT / 2 + 25
                );

                if (this.newRecord) {
                    this.ctx.font = "15px Arial";
                    this.ctx.fillText(
                        `NEW RECORD!!`,
                        CONFIG.WIDTH / 2 - 55,
                        CONFIG.HEIGHT / 2 + 50
                    );
                }
            }
        },

        render() {
            this.clear();

            this.drawScore();

            // player
            this.player.draw(this.ctx);
            this.pipes.forEach(pipe => {
                pipe.draw(this.ctx);
            });
        },

        update() {
            if (this.hasPlayerCollided(this.pipes[0])) {
                this.player.setIsAlive(false);
            }

            if (!this.player.isAlive()) {
                return this.handleGameOver();
            }

            this.player.update();

            const pipesToDelete = [];
            this.pipes.forEach((pipe, index) => {
                pipe.update();

                if (!pipe.isVisibleToPlayer()) {
                    pipesToDelete.push(index);
                }
            });

            pipesToDelete.forEach(pipe => {
                this.pipes.splice(pipe, 1);
            });

            this.score += pipesToDelete.length;
            if (this.score > this.maxScore) {
                this.maxScore = this.score;
                this.newRecord = true;
            }
        },

        onKeyPressed(e) {
            if (!this.isPlaying || KEYS.SPACE != e.keyCode) {
                return this.play();
            }

            this.player.onFlap();
        },

        handleGameOver() {
            this.isPlaying = false;

            clearInterval(this.addPipeInterval);
            this.pipes = [];
        },

        hasPlayerCollided(pipe) {
            if (!pipe) {
                return false;
            }

            const playerRect = this.player.getRect();
            const pipeRect = pipe.getRect();

            const horizontalCollision =
                playerRect.right >= pipeRect.left &&
                playerRect.left <= pipeRect.right;

            if (!horizontalCollision) {
                return false;
            }

            return (
                playerRect.bottom >= pipeRect.bottomSection.top ||
                playerRect.top <= pipeRect.topSection.bottom
            );
        },

        start() {
            this.setup();

            let dt = 0,
                last = window.performance.now();

            const frame = () => {
                const now = window.performance.now();
                dt = dt + Math.min(1, (now - last) / 1000);

                while (dt > CONFIG.UPDATE_INTERVAL) {
                    dt = dt - CONFIG.UPDATE_INTERVAL;
                    this.update();
                }

                last = now;

                this.render();

                window.requestAnimationFrame(frame);
            };

            window.requestAnimationFrame(frame);
        }
    };
}

(() => {
    new Game().start();
})();
