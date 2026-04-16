const axios = require('axios');
const { v7: uuidv7 } = require('uuid');
const Profile = require('../models/Profile');
const { normalizeName } = require('../utils/normalizeName');
const { getAgeGroup } = require('../utils/ageGroup');

const GENDERIZE_URL = 'https://api.genderize.io';
const AGIFY_URL = 'https://api.agify.io';
const NATIONALIZE_URL = 'https://api.nationalize.io';

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

const fetchExternalApis = async (name) => {
    try {
        const [genderizeRes, agifyRes, nationalizeRes] = await Promise.all([
            axios.get(GENDERIZE_URL, { params: { name }, timeout: 10000 }),
            axios.get(AGIFY_URL, { params: { name }, timeout: 10000 }),
            axios.get(NATIONALIZE_URL, { params: { name }, timeout: 10000 })
        ]);

        return {
            genderize: genderizeRes.data,
            agify: agifyRes.data,
            nationalize: nationalizeRes.data
        };
    } catch (error) {
        throw new AppError('Failed to fetch external APIs', 502);
    }
};

const validateGenderize = (data) => {
    if (!data || data.gender === null || data.count === 0) {
        throw new AppError('Genderize returned an invalid response', 502);
    }
};

const validateAgify = (data) => {
    if (!data || data.age === null) {
        throw new AppError('Agify returned an invalid response', 502);
    }
};

const validateNationalize = (data) => {
    if (!data || !Array.isArray(data.country) || data.country.length === 0) {
        throw new AppError('Nationalize returned an invalid response', 502);
    }
};

const pickTopCountry = (countries) => {
    return countries.reduce((best, current) =>
        current.probability > best.probability ? current : best
    );
};

exports.createProfile = async (rawName) => {
    const normalizedName = normalizeName(rawName);

    const existingProfile = await Profile.findOne({
        normalized_name: normalizedName
    }).lean();

    if (existingProfile) {
        return {
            alreadyExists: true,
            profile: existingProfile
        };
    }

    const { genderize, agify, nationalize } = await fetchExternalApis(normalizedName);

    validateGenderize(genderize);
    validateAgify(agify);
    validateNationalize(nationalize);

    const topCountry = pickTopCountry(nationalize.country);

    const profile = await Profile.create({
        id: uuidv7(),
        name: normalizedName,
        normalized_name: normalizedName,
        gender: genderize.gender,
        gender_probability: genderize.probability,
        sample_size: genderize.count,
        age: agify.age,
        age_group: getAgeGroup(agify.age),
        country_id: topCountry.country_id,
        country_probability: topCountry.probability,
        created_at: new Date()
    });

    return {
        alreadyExists: false,
        profile: profile.toObject()
    };
};

exports.getProfileById = async (id) => {
    const profile = await Profile.findOne({ id }).lean();

    if (!profile) {
        throw new AppError('Profile not found', 404);
    }

    return profile;
};

exports.getProfiles = async (filters) => {
    const query = {};

    if (filters.gender) {
        query.gender = new RegExp(`^${filters.gender}$`, 'i');
    }

    if (filters.country_id) {
        query.country_id = new RegExp(`^${filters.country_id}$`, 'i');
    }

    if (filters.age_group) {
        query.age_group = new RegExp(`^${filters.age_group}$`, 'i');
    }

    const profiles = await Profile.find(query)
        .select('id name gender age age_group country_id -_id')
        .sort({ created_at: -1 })
        .lean();

    return profiles;
};

exports.deleteProfile = async (id) => {
    const profile = await Profile.findOneAndDelete({ id });

    if (!profile) {
        throw new AppError('Profile not found', 404);
    }
};

exports.AppError = AppError;