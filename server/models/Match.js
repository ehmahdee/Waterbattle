const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const matchSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    result: {
        type: String,
        enum: ['win', 'loss'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (timestamp) => dateFormat(timestamp),
    },
    // Additional fields for match data (e.g., duration, timestamp, opponent, etc.)
});

const Match = model('Match', matchSchema);

module.exports = Match;