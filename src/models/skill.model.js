import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true, // Support faster lookups by name
    },
}, {
    timestamps: true,
});

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;
