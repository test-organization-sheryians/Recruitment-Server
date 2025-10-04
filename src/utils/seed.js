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

// COMPREHENSIVE PERMISSION MATRIX
const permissionMatrix = {
  admin: [
    // User Management - Full Access
    { resource: "users", action: "create" },
    { resource: "users", action: "read" },
    { resource: "users", action: "update" },
    { resource: "users", action: "delete" },
    { resource: "users", action: "manage" },
    
    // Job Management - Full Access
    { resource: "jobs", action: "create" },
    { resource: "jobs", action: "read" },
    { resource: "jobs", action: "update" },
    { resource: "jobs", action: "delete" },
    { resource: "jobs", action: "manage" },
    
    // Application Management - Full Access
    { resource: "applications", action: "create" },
    { resource: "applications", action: "read" },
    { resource: "applications", action: "update" },
    { resource: "applications", action: "delete" },
    { resource: "applications", action: "manage" },
    
    // Role & Permission Management - Admin Only
    { resource: "roles", action: "create" },
    { resource: "roles", action: "read" },
    { resource: "roles", action: "update" },
    { resource: "roles", action: "delete" },
    { resource: "roles", action: "manage" },
    
    { resource: "permissions", action: "create" },
    { resource: "permissions", action: "read" },
    { resource: "permissions", action: "update" },
    { resource: "permissions", action: "delete" },
    { resource: "permissions", action: "manage" },
    
    // System Administration - Admin Only
    { resource: "system", action: "read" },
    { resource: "system", action: "manage" },
    { resource: "analytics", action: "read" },
    { resource: "analytics", action: "manage" },
    { resource: "reports", action: "read" },
    { resource: "reports", action: "create" },
    
    // Company Management - Admin Only
    { resource: "companies", action: "create" },
    { resource: "companies", action: "read" },
    { resource: "companies", action: "update" },
    { resource: "companies", action: "delete" },
    { resource: "companies", action: "manage" },
    
    // Profile Management
    { resource: "profile", action: "read" },
    { resource: "profile", action: "update" }
  ],
  
  client: [
    // Job Management - Limited
    { resource: "jobs", action: "create" },
    { resource: "jobs", action: "read" },
    { resource: "jobs", action: "update" }, // Only own jobs
    { resource: "jobs", action: "delete" }, // Only own jobs
    
    // Application Management - Read Only
    { resource: "applications", action: "read" }, // Only for own jobs
    
    // Company Profile
    { resource: "companies", action: "read" }, // Only own company
    { resource: "companies", action: "update" }, // Only own company
    
    // Profile Management
    { resource: "profile", action: "read" },
    { resource: "profile", action: "update" },
    
    // Basic Analytics
    { resource: "analytics", action: "read" } // Only own company data
  ],
  
  candidate: [
    // Job Viewing
    { resource: "jobs", action: "read" },
    
    // Application Management
    { resource: "applications", action: "create" },
    { resource: "applications", action: "read" }, // Only own applications
    { resource: "applications", action: "update" }, // Only own applications
    
    // Profile Management
    { resource: "profile", action: "read" },
    { resource: "profile", action: "update" }
  ]
};

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
    console.log("Cleared existing data");

    // Create roles
    const createdRoles = await Role.insertMany(roles);
    const roleMap = {};
    createdRoles.forEach(role => {
      roleMap[role.name] = role._id;
    });
    console.log("Created roles:", Object.keys(roleMap));

    // Create permissions for each role
    const allPermissions = [];
    
    Object.entries(permissionMatrix).forEach(([roleName, permissions]) => {
      permissions.forEach(permission => {
        allPermissions.push({
          resource: permission.resource,
          action: permission.action,
          roleId: roleMap[roleName]
        });
      });
    });

    await Permission.insertMany(allPermissions);
    console.log(`Created ${allPermissions.length} permissions`);

    // Log permissions per role for verification
    Object.entries(permissionMatrix).forEach(([roleName, permissions]) => {
      console.log(`${roleName.toUpperCase()}: ${permissions.length} permissions`);
    });

    // Create sample users
    const users = [
      {
        email: "admin@example.com",
        password: await bcrypt.hash("admin123", 10),
        firstName: "Super",
        lastName: "Admin",
        phoneNumber: "+1234567890",
        roleId: roleMap.admin
      },
      {
        email: "client@example.com", 
        password: await bcrypt.hash("client123", 10),
        firstName: "Hiring",
        lastName: "Manager",
        phoneNumber: "+1234567891",
        roleId: roleMap.client
      },
      {
        email: "candidate@example.com",
        password: await bcrypt.hash("candidate123", 10),
        firstName: "Job",
        lastName: "Seeker", 
        phoneNumber: "+1234567892",
        roleId: roleMap.candidate
      }
    ];

    await User.insertMany(users);
    console.log("Created sample users");

    // Verification: Count permissions per role
    for (const [roleName, roleId] of Object.entries(roleMap)) {
      const count = await Permission.countDocuments({ roleId });
      console.log(`${roleName}: ${count} permissions in database`);
    }

    console.log("Database seeded successfully!");
    console.log("\nSample Login Credentials:");
    console.log("Admin: admin@example.com / admin123");
    console.log("Client: client@example.com / client123"); 
    console.log("Candidate: candidate@example.com / candidate123");
    
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
