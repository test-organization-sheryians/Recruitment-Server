import ClientService from "../services/client.service.js";

class ClientController {
  constructor() {
    this.clientService = new ClientService();
  }

  createClient = async (req, res, next) => {
    console.log("anuj");
    
    try {
      const data = req.body;
      const result = await this.clientService.createClient(data);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getAllClients = async (req, res, next) => {
    try {
      const clients = await this.clientService.getAllClients();
      res.status(200).json({ success: true, data: clients });
    } catch (error) {
      next(error);
    }
  };

  getClientById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const client = await this.clientService.getClientById(id);
      res.status(200).json({ success: true, data: client });
    } catch (error) {
      next(error);
    }
  };

  updateClient = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const updated = await this.clientService.updateClient(id, data);
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  };

  deleteClient = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.clientService.deleteClient(id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };
}

export default new ClientController();
