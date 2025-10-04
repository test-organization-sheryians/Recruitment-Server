class JobApplicationController {
    constructor(service) {
        this.service = service;
        this.create = this.create.bind(this);
        this.findById = this.findById.bind(this);
        this.findAll = this.findAll.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
    }

    async create(req, res, next) {
        try {
            const data = await this.service.create(req.body);
            res.status(201).json({ success: true, data, message: 'Job application created' });
        } catch (err) { next(err); }
    }
    async findById(req, res, next) {
        try {
            const data = await this.service.findById(req.params.id);
            res.json({ success: true, data, message: 'Fetched successfully' });
        } catch (err) { next(err); }
    }
    async findAll(req, res, next) {
        try {
            const data = await this.service.findAll();
            res.json({ success: true, data, message: 'List fetched successfully' });
        } catch (err) { next(err); }
    }
    async update(req, res, next) {
        try {
            const data = await this.service.update(req.params.id, req.body);
            res.json({ success: true, data, message: 'Updated successfully' });
        } catch (err) { next(err); }
    }
    async delete(req, res, next) {
        try {
            await this.service.delete(req.params.id);
            res.json({ success: true, data: null, message: 'Deleted successfully' });
        } catch (err) { next(err); }
    }
    async updateStatus(req, res, next) {
        try {
            const data = await this.service.updateStatus(req.params.id, req.body.status);
            res.json({ success: true, data, message: 'Status updated successfully' });
        } catch (err) { next(err); }
    }
}
export default JobApplicationController;
