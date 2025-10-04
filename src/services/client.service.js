import MongoUserRepository from "../repositories/implementations/MongoUserRepository.js";
import MongoClientRepository from "../repositories/implementations/mongoClientRepository.js";
import { AppError } from "../utils/errors.js";
import Role from "../models/role.model.js"; 

class ClientService {
  constructor() {
    this.userRepository = new MongoUserRepository();
    this.clientRepository = new MongoClientRepository();
  }

  async createClient(clientData) {
    const { user, companyId, emails, phone, designation, roleId } = clientData;

    console.log("service", clientData);

    let Founduser = await this.userRepository.findUserById(user);
    if (!Founduser) throw new AppError("User not found", 404);

    let clientRoleId = roleId;
  

       console.log("clientRoleId", clientRoleId,Founduser);
       
    const updateduser = await this.userRepository.updateUser(user, { roleId: clientRoleId });
 
    const client = await this.clientRepository.createClient({
      user,
      companyId,
      emails,
      phone,
      designation,
    });

    return {
      user: {
        id: updateduser._id,
        email: updateduser.email,
        roleId: updateduser.roleId,
      },
      client,
    };
  }
   async getAllClients() {
    const clients = await this.clientRepository.getAllClients();
    return clients;
  }

  async getClientById(id) {
    const client = await this.clientRepository.getClientById(id);
    if (!client) throw new AppError("Client not found", 404);
    return client;
  }

  async updateClient(id, updateData) {
    const client = await this.clientRepository.updateClient(id, updateData);
    if (!client) throw new AppError("Client not found", 404);
    return client;
  }

  async deleteClient(id) {
    const deleted = await this.clientRepository.deleteClient(id);
    if (!deleted) throw new AppError("Client not found", 404);
    return { message: "Client deleted successfully" };
  }
}


export default ClientService;
