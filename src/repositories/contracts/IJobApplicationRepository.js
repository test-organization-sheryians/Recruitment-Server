class IJobApplicationRepository {
    create(jobAppDto) { throw new Error('Not implemented'); }
    findById(id) { throw new Error('Not implemented'); }
    findAll(filter, options) { throw new Error('Not implemented'); }
    updateById(id, updateDto) { throw new Error('Not implemented'); }
    deleteById(id) { throw new Error('Not implemented'); }
    updateStatusById(id, status) { throw new Error('Not implemented'); }
    findByDuplicateHash(hash) { throw new Error('Not implemented'); }
}
export default IJobApplicationRepository;
