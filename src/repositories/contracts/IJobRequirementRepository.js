class IJobRequirementRepository {
  async create(requirementData) {
    throw new Error("Method not implemented");
  }

  async findById(id) {
    throw new Error("Method not implemented");
  }

  async findAll(filter = {}) {
    throw new Error("Method not implemented");
  }

  async update(id, requirementData) {
    throw new Error("Method not implemented");
  }

  async delete(id) {
    throw new Error("Method not implemented");
  }

  async findByCompanyId(companyId) {
    throw new Error("Method not implemented");
  }

  async findByStatus(status) {
    throw new Error("Method not implemented");
  }
}

export default IJobRequirementRepository;
