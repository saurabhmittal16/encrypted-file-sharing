const fastify = require("fastify");
const mongoose = require("mongoose");
const path = require('path');

// initialise fastify app
const app = fastify({
    ignoreTrailingSlash: true
});

// load .env file to environment variables
require("dotenv").config();

// get Mongo constants from environment variables
const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_DB, MONGO_HOST, MONGO_PORT } = process.env;
const mongo_url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

// use CORS
app.register(require('fastify-cors'));

// allow multipart
app.register(require('fastify-multipart'), { attachFieldsToBody: true });

app.register(require('fastify-static'), {
	root: path.join(__dirname, "../tmp/")
});

const routes = require("./routes")

// welcome route for API
app.get("/", async () => {
	return {
		message: "Welcome to File Sharing"
	};
});

routes.forEach(route => app.route(route));

// connect to mongodb and serve fastify app
mongoose
	.connect(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log("Connected to DB");
		app.listen(8080, "0.0.0.0", function(err, address) {
			if (err) {
				console.log(err);
				process.exit(1);
			}
			console.log(`Server listening on ${address}`);
		});
	})
	.catch(err => console.log(err.message));

mongoose.set("useCreateIndex", true);
