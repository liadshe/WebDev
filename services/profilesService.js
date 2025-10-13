const Profile = require("../models/Profile");

const getAllProfiles = async () => {
    const profiles = await Profile.find();
    return profiles;
}

const getProfileById = async (id) => {
    return await Profile.findById(id);
};

const getProfileByName = async (name) => {
    return await Profile.find({name: name});
};


module.exports = {
    getAllProfiles,
    getProfileById,
    getProfileByName
};

// async function createProfile() {
//     // const profile = new Profile({name:'noa', userName:"bla", profilePicture:"pig.jpg" });
//     // await profile.save();
//     // const profile = await Profile.create({name:"liad", userName:"liash", profilePicture:"cow.jpg"});
//     // console.log(`saved profile ${profile.userName} to DB`);
//     // profile.userName = "Liadshmar";
//     // profile.save();
//     // console.log(`updated profile username to ${profile.userName}`)
//     try {
//         await Profile.create({name: "avia", userName:"Aviul", profilePicture:"mouse.jpg"})
//     } catch(e) {console.log(e.message);

//     }

//     const profile = await Profile.find({
//         name: "liad"
//     });
//     console.log(profile)
// }

// createProfile();