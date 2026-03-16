const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['Lost', 'Found'], required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    image: { type: String }, // Cloudinary URL
    status: { type: String, enum: ['Unclaimed', 'Claimed'], default: 'Unclaimed' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
