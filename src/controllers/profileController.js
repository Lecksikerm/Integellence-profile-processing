const asyncHandler = require('../utils/asyncHandler');
const profileService = require('../services/profileService');

exports.createProfile = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (name === undefined) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing or empty name'
        });
    }

    if (typeof name !== 'string') {
        return res.status(422).json({
            status: 'error',
            message: 'Invalid type'
        });
    }

    if (!name.trim()) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing or empty name'
        });
    }

    const result = await profileService.createProfile(name);

    if (result.alreadyExists) {
        return res.status(200).json({
            status: 'success',
            message: 'Profile already exists',
            data: result.profile
        });
    }

    return res.status(201).json({
        status: 'success',
        data: result.profile
    });
});

exports.getProfileById = asyncHandler(async (req, res) => {
    const profile = await profileService.getProfileById(req.params.id);

    res.status(200).json({
        status: 'success',
        data: profile
    });
});

exports.getProfiles = asyncHandler(async (req, res) => {
    const profiles = await profileService.getProfiles(req.query);

    res.status(200).json({
        status: 'success',
        count: profiles.length,
        data: profiles
    });
});

exports.deleteProfile = asyncHandler(async (req, res) => {
    await profileService.deleteProfile(req.params.id);
    res.status(204).send();
});