// src/utils/seed.js
import mongoose from "mongoose";
import Role from "../models/role.model.js";
import Permission from "../models/permission.model.js";
import User from "../models/user.model.js";
import config from "../config/environment.js";
import bcrypt from "bcryptjs";

const roles = [
  { name: "admin", description: "System administrator with full access" },
  { name: "client", description: "Company recruiter with job posting privileges" },
  { name: "candidate", description: "Job seeker with basic access" }
];

const permissions = [
  // Admin permissions
  { resource: "users", action: "manage" },
  { resource: "jobs", action: "manage" },
  { resource: "applications", action: "manage" },
  
  // Client permissions
  { resource: "jobs", action: "create" },
  { resource: "jobs", action: "update" },
  { resource: "applications", action: "read" },
  
  // Candidate permissions
  { resource: "jobs", action: "read" },
  { resource: "applications", action: "create" },
  { resource: "profile", action: "update" }
];

export const seedDatabase = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Promise.all([
      Role.deleteMany({}),
      Permission.deleteMany({}),
      User.deleteMany({})
    ]);

    // Create roles
    const createdRoles = await Role.insertMany(roles);
    const roleMap = {};
    createdRoles.forEach(role => {
      roleMap[role.name] = role._id;
    });

    // Create permissions
    const permissionDocs = [];
    permissions.forEach((perm, index) => {
      const roleName = index < 3 ? "admin" : index < 6 ? "client" : "candidate";
      permissionDocs.push({
        ...perm,
        roleId: roleMap[roleName]
      });
    });
    await Permission.insertMany(permissionDocs);

    // Create sample users
    const users = [
      {
        email: "admin@example.com",
        password: await bcrypt.hash("admin123", 10),
        firstName: "Admin",
        lastName: "User",
        roleId: roleMap.admin
      },
      {
        email: "client@example.com",
        password: await bcrypt.hash("client123", 10),
        firstName: "Client",
        lastName: "User",
        roleId: roleMap.client
      },
      {
        email: "candidate@example.com",
        password: await bcrypt.hash("candidate123", 10),
        firstName: "Candidate",
        lastName: "User",
        roleId: roleMap.candidate
      }
    ];

    await User.insertMany(users);
    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
