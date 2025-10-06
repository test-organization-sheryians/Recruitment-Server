export default class IClientRepository {
  /**
   * @param {Object} clientData
   * @returns {Promise<Object>} Created client
   */
  async createClient(clientData) {
    throw new Error("Method not implemented");
  }

  /**
   * Find client by userId
   * @param {String} userId
   * @returns {Promise<Object|null>}
   */
  async findClientByUserId(userId) {
    throw new Error("Method not implemented");
  }

  /**
   * Find client by companyId
   * @param {String} companyId
   * @returns {Promise<Array<Object>>}
   */
  async findClientsByCompanyId(companyId) {
    throw new Error("Method not implemented");
  }

  /**
   * Update client details
   * @param {String} clientId
   * @param {Object} updateData
   * @returns {Promise<Object>} Updated client
   */
  async updateClient(clientId, updateData) {
    throw new Error("Method not implemented");
  }

  /**
   * Delete client
   * @param {String} clientId
   * @returns {Promise<Boolean>} success
   */
  async deleteClient(clientId) {
    throw new Error("Method not implemented");
  }
}