import Config from "./config.js";

export default function() {
    const height = 50;
    const width = 50;

    const initialPlayerX = 50;
    const initialPlayerY = Config.HEIGHT / 2 - height / 2;

    return {
        x: initialPlayerX,
        y: initialPlayerY,

        acceleration: 0,
        speed: 0,

        maxSpeed: Config.MAX_SPEED,

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
            if (this.y > Config.HEIGHT) {
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

            this.acceleration = Config.GRAVITY;

            if (this.isJumping) {
                this.acceleration -= Config.IMPULSE;
            }

            let speed =
                this.speed +
                this.acceleration +
                this.acceleration * Config.UPDATE_INTERVAL;

            this.speed = Math.max(
                -this.maxSpeed,
                Math.min(this.maxSpeed, speed)
            );

            this.y += this.speed * Config.UPDATE_INTERVAL;
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
