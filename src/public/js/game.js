import Config from "./config.js";
import Player from "./player.js";
import Pipe from "./pipe.js";

const KEYS = {
    SPACE: 32
};

export default function() {
    const canvas = document.getElementById(Config.DOM_ELEMENT_ID);
    const ctx = canvas.getContext("2d");

    return {
        // -------- Game properties -------- //

        canvas,
        ctx,

        isPlaying: false,

        player: null,
        pipes: [],

        score: 0,
        newRecord: false,

        maxScore:
            parseInt(
                window.localStorage.getItem(Config.LOCAL_STORAGE_MAX_SCORE_KEY)
            ) || 0,

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

        play() {
            if (!this.player.isAlive()) {
                return this.setup();
            }

            this.isPlaying = true;
            this.player.toggleGravity();

            clearInterval(this.addPipeInterval);
            this.addPipeInterval = setInterval(
                this.addPipe.bind(this),
                Config.PIPE_INTERVAL
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
                    Config.WIDTH - 100,
                    30
                );
            }

            if (!this.player.isAlive()) {
                this.ctx.fillText(
                    "GAME OVER",
                    Config.WIDTH / 2 - 60,
                    Config.HEIGHT / 2
                );

                this.ctx.font = "13px Arial";
                this.ctx.fillText(
                    `MAX SCORE: ${this.maxScore}`,
                    Config.WIDTH / 2 - 45,
                    Config.HEIGHT / 2 + 25
                );

                if (this.newRecord) {
                    this.ctx.font = "15px Arial";
                    this.ctx.fillText(
                        `NEW RECORD!!`,
                        Config.WIDTH / 2 - 55,
                        Config.HEIGHT / 2 + 50
                    );
                }
            }
        },

        clear() {
            this.ctx.clearRect(0, 0, Config.WIDTH, Config.HEIGHT);
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
                this.newRecord = true;
                this.maxScore = this.score;
                window.localStorage.setItem(
                    Config.LOCAL_STORAGE_MAX_SCORE_KEY,
                    this.score
                );
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

                while (dt > Config.UPDATE_INTERVAL) {
                    dt = dt - Config.UPDATE_INTERVAL;
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
