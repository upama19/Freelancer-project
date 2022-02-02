const sharp = require('sharp');
const Talent = require('../models/talent')

const saveProfilePicture = async (req, res) => {
    try {
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
        req.user.profilePicture = buffer;

        await req.user.save();

        res.send();
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

const deleteProfilePicture = async (req, res) => {
    try {
        req.user.profilePicture = undefined;
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
}

const getProfilePicture = async (req, res) => {
    try {
        const talent = Talent.findById(req.params.id);

        if (!talent || !talent.profilePicture) {
            throw new Error('Cannot find the required talent')
        }

        res.set('Content-Type', 'image/png')
        res.send(talent.profilePicture)
    } catch (error) {
        res.status(404).send()
    }
}

module.exports = {
    saveProfilePicture,
    deleteProfilePicture,
    getProfilePicture
}