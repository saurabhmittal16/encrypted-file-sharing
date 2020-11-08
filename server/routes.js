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
    }
];

module.exports = routes;