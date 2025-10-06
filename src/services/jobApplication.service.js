import { AppError } from '../utils/errors.js';

class JobApplicationService {
    constructor(repository) {
        this.repo = repository;
    }
    async create(jobAppDto) {
        const exists = await this.repo.findByDuplicateHash(jobAppDto.duplicateCheckHash);
        if (exists) throw new AppError('Duplicate job application detected', 409);
        try {
            return await this.repo.create(jobAppDto);
        } catch (err) {
            if (err.code === 11000) throw new AppError('Duplicate job application', 409);
            throw err;
        }
    }
    async findById(id) {
        const app = await this.repo.findById(id);
        if (!app) throw new AppError('Job application not found', 404);
        return app;
    }
    async findAll(filter = {}, options = {}) {
        return this.repo.findAll(filter, options);
    }
    async update(id, dto) {
        const updated = await this.repo.updateById(id, dto);
        if (!updated) throw new AppError('Job application not found', 404);
        return updated;
    }
    async delete(id) {
        const deleted = await this.repo.deleteById(id);
        if (!deleted) throw new AppError('Job application not found', 404);
        return deleted;
    }
    async updateStatus(id, status) {
        const updated = await this.repo.updateStatusById(id, status);
        if (!updated) throw new AppError('Job application not found', 404);
        return updated;
    }
}
export default JobApplicationService;
