const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true },
    createdDate: { typeNumber: Date },
    updatedDate: { typeNumber: Date }
});

userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.passwordHash;

        if (ret.photos.length) {

            ret.photos = ret.photos.map(photoPath => {
                return photoPath;
            });
        }
    }
});

module.exports = mongoose.model('User', userSchema);