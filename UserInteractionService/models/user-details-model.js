const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userDetailsSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    description: { type: String, required: true },
    sumVotes: {type: Number, default: 0},
    numberOfVotes: {type: Number, default: 0},
    photos: {type: [String]}
});

userDetailsSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
});

module.exports = mongoose.model('UserDetails', userDetailsSchema);