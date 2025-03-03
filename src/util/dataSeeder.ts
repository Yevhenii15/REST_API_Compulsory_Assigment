import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { ownerModel } from "../models/ownerModel";
import { catModel } from "../models/catModel";
import dotenv from "dotenv";

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.DBHOST as string);
    console.log("Connected to MongoDB Atlas...");

    // Clear existing data
    await ownerModel.deleteMany({});
    await catModel.deleteMany({});
    console.log("Existing data cleared.");

    // Hash passwords
    const hashedPasswords = await Promise.all([
      bcrypt.hash("123456", 10),
      bcrypt.hash("123456", 10),
    ]);

    // Seed Owners
    const owners = await ownerModel.insertMany([
      {
        name: "Yevhenii",
        email: "yev@example.com",
        password: hashedPasswords[0],
        phoneNumber: "1234567890",
        address: "123 Main St",
      },
      {
        name: "New Owner",
        email: "new@example.com",
        password: hashedPasswords[1],
        phoneNumber: "0987654321",
        address: "456 Side St",
      },
    ]);
    console.log("Owners seeded.");

    // Seed Cats
    await catModel.insertMany([
      {
        name: "Whiskers",
        age: 2,
        breed: "Siamese",
        color: "Cream",
        weight: 4.5,
        isVaccinated: true,
        birthDate: new Date("2022-02-15"),
        _owner: owners[1]._id,
      },
      {
        name: "Garfield",
        age: 2,
        breed: "Maine Coon",
        color: "Orange",
        weight: 8.2,
        isVaccinated: true,
        birthDate: new Date("2022-02-06"),
        _owner: owners[0]._id,
      },
    ]);
    console.log("Cats seeded.");

    mongoose.connection.close();
    console.log("Database seeding complete and connection closed.");
  } catch (error) {
    console.error("Error seeding database:", error);
    mongoose.connection.close();
  }
};

seedDatabase();
