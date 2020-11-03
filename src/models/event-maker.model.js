const { Schema, model } = require('mongoose');

const EventMakerEntity = new Schema(
    {
        makerId: {type: String, required: true},
        eventId: {type: String, required: true},
        createdAt: { type: Number, default: Date.now() },
        deletedAt: { type: Number, default: null },
    },
    {
        versionKey: false, // remove field "__v"
    },
);

module.exports = model('EventMaker', EventMakerEntity);
