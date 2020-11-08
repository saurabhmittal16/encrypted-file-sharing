const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const entrySchema = new mongoose.Schema({
	path: String,
	encryptedPath: String,
    password: String
}, {
	versionKey: false
});

entrySchema.index({ path: 1 });

entrySchema.pre("save", function(next) {
	let entry = this;
	if (!entry.isModified("password")) {
		return next();
	}
	let hash = bcrypt.hashSync(entry.password);
	entry.password = hash;
	next();
});

entrySchema.methods.comparePassword = function(password) {
    let entry = this;
    return bcrypt.compareSync(password, entry.password);
}

module.exports = mongoose.model("Entry", entrySchema);