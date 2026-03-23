const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    wage: { type: Number, required: true },
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
    },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['open', 'closed'], default: 'open' }
});

// Add 2dsphere index for location-based search
jobSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Job', jobSchema);
