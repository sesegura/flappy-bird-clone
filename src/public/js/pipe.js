import Config from "./config.js";

export default function() {
    return {
        x: Config.WIDTH,

        topSection: null,
        bottomSection: null,

        width: Config.PIPE_WIDTH,

        _isActive: false,

        init() {
            const top = Math.floor(Math.random() * (Config.PIPES - 4) + 2);

            this.topSection = Config.PIPE_HEIGHT * top;
            this.bottomSection = Config.PIPE_HEIGHT * (Config.PIPES - top - 2);

            this._isActive = true;
        },

        isActive() {
            return this._isActive;
        },

        isVisibleToPlayer() {
            return this.x + this.width >= 0;
        },

        update() {
            this.x -= Config.PIPE_SPEED * Config.UPDATE_INTERVAL;
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
                this.topSection + Config.PIPE_HEIGHT * 2,
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
                    top: Config.HEIGHT - this.bottomSection,
                    bottom: Config.HEIGHT
                }
            };
        }
    };
}
