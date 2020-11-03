const { Schema, model } = require('mongoose');

const MakerEntity = new Schema(
    {
        name: { type: String, default: 'maker-name' },
        description: { type: String, default: 'description' },
        category: { type: String, default: 'RED' },
        updatedAt: { type: Number, default: Date.now() },
        createdAt: { type: Number, default: Date.now() },
        deletedAt: { type: Number, default: null },
    },
    {
        versionKey: false, // remove field "__v"
    },
);

module.exports = model('Makers', MakerEntity);
