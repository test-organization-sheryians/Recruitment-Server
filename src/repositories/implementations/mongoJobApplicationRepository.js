import JobApplication from '../../models/jobApplication.model.js';
import IJobApplicationRepository from '../contracts/IJobApplicationRepository.js';

class MongoJobApplicationRepository extends IJobApplicationRepository {
    async create(dto) { return JobApplication.create(dto); }
    async findById(id) { return JobApplication.findById(id); }
    async findAll(filter = {}, options = {}) { return JobApplication.find(filter, null, options); }
    async updateById(id, dto) { return JobApplication.findByIdAndUpdate(id, dto, { new: true }); }
    async deleteById(id) { return JobApplication.findByIdAndDelete(id); }
    async updateStatusById(id, status) { return JobApplication.findByIdAndUpdate(id, { status }, { new: true }); }
    async findByDuplicateHash(hash) { return JobApplication.findOne({ duplicateCheckHash: hash }); }
}
export default MongoJobApplicationRepository;
