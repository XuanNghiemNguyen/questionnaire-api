const { Schema, model } = require('mongoose');

const EventEntity = new Schema(
    {
        name: { type: String, default: 'event-name', required: true },
        description: { type: String, default: 'description' },
        startTime: { type: Number, default: Date.now() },
        endTime: { type: Number, default: Date.now() },
        isRunning: { type: Boolean, default: 'false' },
        productIds: [String],
        makerIds: [String],
        categoriesName: {
            RED: { type: String, default: 'This is category red' },
            GREEN: { type: String, default: 'This is category green' },
            BLUE: { type: String, default: 'This is category blue' },
        },
        updatedAt: { type: Number, default: Date.now() },
        createdAt: { type: Number, default: Date.now() },
        deletedAt: { type: Number, default: null },
    },
    {
        versionKey: false, // remove field "__v"
    },
);

module.exports = model('Events', EventEntity);
