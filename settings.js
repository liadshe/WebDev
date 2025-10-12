const mongoose = require("mongoose");
const Profile = require("./models/Profile")

mongoose.connect("mongodb://localhost:27017/Netflix");

async function createProfile() {
    // const profile = new Profile({name:'noa', userName:"bla", profilePicture:"pig.jpg" });
    // await profile.save();
    // const profile = await Profile.create({name:"liad", userName:"liash", profilePicture:"cow.jpg"});
    // console.log(`saved profile ${profile.userName} to DB`);
    // profile.userName = "Liadshmar";
    // profile.save();
    // console.log(`updated profile username to ${profile.userName}`)
    try {
        await Profile.create({name: "avia", userName:"Aviul", profilePicture:"mouse.jpg"})
    } catch(e) {console.log(e.message);

    }

    const profile = await Profile.find({
        name: "liad"
    });
    console.log(profile)
}

createProfile();