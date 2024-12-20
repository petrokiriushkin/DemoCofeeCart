const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
        baseUrl: "https://coffee-cart.app",
        "reporter": "mochawesome",
        "reporterOptions": {
            "charts": true,
            "overwrite": true,
            "html": true,
            "json": false,
            "reportDir": "results"
        },
        setupNodeEvents(on, config) {
        },
    },
});
