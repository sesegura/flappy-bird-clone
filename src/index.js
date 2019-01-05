const CONFIG = {
    DOM_ELEMENT_ID: "canvas",

    HEIGHT: 600,
    WIDTH: 800,

    // frames related config
    FPS: 60,
    UPDATE_INTERVAL: 1 / 60
};

function Game() {
    return {
        // -------- Game properties -------- //

        canvas: null,
        ctx: null,

        // -------- Methods -------- //

        setup() {
            this.canvas = document.getElementById(CONFIG.DOM_ELEMENT_ID);

            // dimension setup
            this.canvas.height = CONFIG.HEIGHT;
            this.canvas.width = CONFIG.WIDTH;

            this.ctx = this.canvas.getContext("2d");
        },

        start() {
            this.setup();

            let tsDiff = 0,
                last = window.performance.now();

            const frame = () => {
                const now = window.performance.now();
                tsDiff = tsDiff + Math.min(1, (now - last) / 1000);

                while (tsDiff > CONFIG.UPDATE_INTERVAL) {
                    tsDiff = tsDiff - CONFIG.UPDATE_INTERVAL;
                }

                last = now;

                this.render();

                window.requestAnimationFrame(frame);
            };

            window.requestAnimationFrame(frame);
        },

        render() {
            this.ctx.clearRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
            this.ctx.fillText("Hello, World!", 10, 50);
        }
    };
}

(() => {
    new Game().start();
})();
