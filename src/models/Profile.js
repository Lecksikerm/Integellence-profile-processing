const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        normalized_name: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        gender: {
            type: String,
            required: true
        },
        gender_probability: {
            type: Number,
            required: true
        },
        sample_size: {
            type: Number,
            required: true
        },
        age: {
            type: Number,
            required: true
        },
        age_group: {
            type: String,
            enum: ['child', 'teenager', 'adult', 'senior'],
            required: true,
            index: true
        },
        country_id: {
            type: String,
            required: true,
            uppercase: true,
            index: true
        },
        country_probability: {
            type: Number,
            required: true
        },
        created_at: {
            type: Date,
            required: true,
            default: () => new Date()
        }
    },
    {
        versionKey: false
    }
);

profileSchema.set('toJSON', {
    transform: (_, ret) => {
        delete ret._id;
        delete ret.normalized_name;
        return ret;
    }
});

profileSchema.set('toObject', {
    transform: (_, ret) => {
        delete ret._id;
        delete ret.normalized_name;
        return ret;
    }
});

module.exports = mongoose.model('Profile', profileSchema);