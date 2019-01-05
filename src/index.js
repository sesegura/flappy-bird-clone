const CONFIG = {
    DOM_ELEMENT_ID: "canvas",

    HEIGHT: 600,
    WIDTH: 800,

    // frames related config
    FPS: 60,
    UPDATE_INTERVAL: 1 / 60,

    // physics
    GRAVITY: 9.8
};

function Player() {
    const height = (width = 50);

    const initialPlayerX = 50;
    const initialPlayerY = CONFIG.HEIGHT / 2 - height / 2;

    return {
        x: initialPlayerX,
        y: initialPlayerY,

        height,
        width,

        isGravityActive: false,

        draw(ctx) {
            if (!this.isGravityActive) {
                return ctx.fillRect(this.x, this.y, this.width, this.height);
            }

            this.y += CONFIG.GRAVITY;

            ctx.fillRect(this.x, this.y, this.width, this.height);
        },

        isAlive() {
            if (CONFIG.GRAVITY + this.y > CONFIG.HEIGHT) {
                return false;
            }

            return true;
        },

        toggleGravity() {
            this.isGravityActive = true;
        }
    };
}

function Game() {
    return {
        // -------- Game properties -------- //

        canvas: null,
        ctx: null,

        player: null,

        onPlayHandler: null,

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
        },

        play() {
            if (!this.player.isAlive()) {
                return this.start();
            }

            this.player.toggleGravity();
        },

        clear() {
            this.ctx.clearRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
        },

        render() {
            this.clear();

            // player
            this.player.draw(this.ctx);

            if (!this.player.isAlive()) {
                this.ctx.fillText(
                    "GAME OVER",
                    CONFIG.WIDTH / 2 - 25,
                    CONFIG.HEIGHT / 2
                );
            }
        },

        update() {
            if (!this.player.isAlive()) {
                return this.handleGameOver();
            }
        },

        start() {
            this.setup();

            let tsDiff = 0,
                last = window.performance.now();

            const frame = () => {
                if (!this.player.isAlive()) {
                    return;
                }

                const now = window.performance.now();
                tsDiff = tsDiff + Math.min(1, (now - last) / 1000);

                while (tsDiff > CONFIG.UPDATE_INTERVAL) {
                    tsDiff = tsDiff - CONFIG.UPDATE_INTERVAL;
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
