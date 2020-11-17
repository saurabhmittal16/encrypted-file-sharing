const controller = require('./controller')

const routes = [
    {
        method: "POST",
        url: "/api/file",
        handler: controller.createNew
    },

    {
        method: "GET",
        url: "/api/file",
        handler: controller.getFile
    },

    {
        method: "GET",
        url: "/api/check",
        handler: controller.checkFile
    }
];

module.exports = routes;