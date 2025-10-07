import educationService from "../services/education.service.js";
import { educationSchema } from "../middlewares/validators/education.validator.js";

const createEducation = async (req, res) => {
  const { error } = educationSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const result = await educationService.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllEducations = async (req, res) => {
  try {
    const educations = await educationService.getAll();
    res.json(educations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getEducationById = async (req, res) => {
  try {
    const education = await educationService.getById(req.params.id);
    if (!education) return res.status(404).json({ message: "Education not found" });
    res.json(education);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateEducation = async (req, res) => {
  const { error } = educationSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const updated = await educationService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Education not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteEducation = async (req, res) => {
  try {
    const deleted = await educationService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Education not found" });
    res.json({ message: "Education deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default {
  createEducation,
  getAllEducations,
  getEducationById,
  updateEducation,
  deleteEducation
};
