import mongoose from 'mongoose';

const JobApplicationSchema = new mongoose.Schema(
    {
        candidateId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // Or 'CandidateProfile' if that's the model
            index: true,
        },
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'JobRole',
            index: true,
        },
        resumeFile: { type: String, required: true },
        resumeScore: { type: Number },
        status: {
            type: String,
            enum: ['applied', 'shortlisted', 'rejected', 'forwarded', 'interview', 'hired'],
            default: 'applied',
        },
        duplicateCheckHash: { type: String, required: true, unique: true, index: true },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        collection: 'job_applications',
    }
);

JobApplicationSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
JobApplicationSchema.set('toJSON', { virtuals: true });

const JobApplication = mongoose.model('JobApplication', JobApplicationSchema);
export default JobApplication;
