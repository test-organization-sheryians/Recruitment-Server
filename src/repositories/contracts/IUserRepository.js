// contracts/IUserRepository.js
class IUserRepository {
  async createUser(userData) {
    throw new Error("Method not implemented");
  }

  async findUserByEmail(email) {
    throw new Error("Method not implemented");
  }

  async findUserById(id) {
    throw new Error("Method not implemented");
  }

  async updateUser(id, userData) {
    throw new Error("Method not implemented");
  }
}

export default IUserRepository;
