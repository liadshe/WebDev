const profileService = require("../services/profilesService");

async function getAllProfiles(req,res) {
    try {
            const profiles = await profileService.getAllProfiles();
            res.json(profiles)
    } catch(err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

async function getProfileById(req,res) {
    try {
            const {id} = req.params;
            const profiles = await profileService.getProfileById(id);
            res.json(profiles)
    } catch(err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

async function getProfileByName(req,res) {
    try {
            const {name} = req.params;
            const profiles = await profileService.getProfileByName(name);
            res.json(profiles)
    } catch(err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};


module.exports={
    getAllProfiles,
    getProfileById,
    getProfileByName
};