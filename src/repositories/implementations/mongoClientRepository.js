// repositories/MongoClientRepository.js
import ClientModel from "../../models/client.model.js";
import { AppError } from "../../utils/errors.js";

class MongoClientRepository {
  async createClient(data) {
    try {
      const client = new ClientModel(data);
      return await client.save();
    } catch (error) {
      throw new AppError("Failed to create client", 500, error);
    }
  }

  async findClientByUserId(userId) {
    try {
      return await ClientModel.findOne({ userId });
    } catch (error) {
      throw new AppError("Failed to find client by userId", 500, error);
    }
  }

  async findClientById(id) {
    try {
      return await ClientModel.findById(id);
    } catch (error) {
      throw new AppError("Failed to find client by ID", 500, error);
    }
  }

  async updateClient(id, updateData) {
    try {
      return await ClientModel.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      throw new AppError("Failed to update client", 500, error);
    }
  }

  async deleteClient(id) {
    try {
      return await ClientModel.findByIdAndDelete(id);
    } catch (error) {
      throw new AppError("Failed to delete client", 500, error);
    }
  }
}

export default MongoClientRepository;
