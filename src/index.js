const CONFIG = {
    DOM_ELEMENT_ID: "canvas",

    HEIGHT: 600,
    WIDTH: 800,

    // frames related config
    FPS: 60,
    UPDATE_INTERVAL: 1 / 60,

    // physics
    GRAVITY: 9.8,
    IMPULSE: 600
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

        maxSpeed: 400,

        height,
        width,

        isJumping: false,

        isGravityActive: false,

        isAlive() {
            if (CONFIG.GRAVITY + this.y > CONFIG.HEIGHT) {
                return false;
            }

            return true;
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

        draw(ctx, dt) {
            if (!this.isAlive()) {
                return;
            }

            ctx.fillText(`speed ${this.speed}`, 10, 20);

            ctx.fillRect(this.x, this.y, this.width, this.height);

            this.isJumping = false;
        }
    };
}

function Game() {
    return {
        // -------- Game properties -------- //

        canvas: null,
        ctx: null,

        isPlaying: false,

        player: null,

        onPlayHandler: null,
        onKeyDownHandler: null,

        // -------- Methods -------- //

        setup() {
            this.canvas = document.getElementById(CONFIG.DOM_ELEMENT_ID);

            this.ctx = this.canvas.getContext("2d");

            this.player = new Player();

            this.onPlayHandler = this.onPlayHandler
                ? this.onPlayHandler
                : this.play.bind(this);

            this.canvas.removeEventListener("click", this.onPlayHandler);
            this.canvas.addEventListener("click", this.onPlayHandler);

            this.onKeyDownHandler = this.onKeyDownHandler
                ? this.onKeyDownHandler
                : this.onKeyDown.bind(this);

            window.removeEventListener("keydown", this.onKeyDownHandler);
            window.addEventListener("keydown", this.onKeyDownHandler);
        },

        play() {
            if (!this.player.isAlive()) {
                return this.setup();
            }

            this.isPlaying = true;
            this.player.toggleGravity();
        },

        clear() {
            this.ctx.clearRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
        },

        render(dt) {
            this.clear();

            // player
            this.player.draw(this.ctx, dt);
            this.ctx.fillText(`y: ${this.player.y}`, 10, 10);

            if (!this.player.isAlive()) {
                this.ctx.fillText(
                    "GAME OVER",
                    CONFIG.WIDTH / 2 - 25,
                    CONFIG.HEIGHT / 2
                );
            }
        },

        onKeyDown(e) {
            if (!this.isPlaying || KEYS.SPACE != e.keyCode) {
                return this.play();
            }

            this.player.onFlap();
        },

        handleGameOver() {
            this.isPlaying = false;
        },

        update() {
            if (!this.player.isAlive()) {
                return this.handleGameOver();
            }

            this.player.update();
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

                this.render(dt);

                window.requestAnimationFrame(frame);
            };

            window.requestAnimationFrame(frame);
        }
    };
}

(() => {
    new Game().start();
})();
