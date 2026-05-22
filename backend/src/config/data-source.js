// backend/src/config/data-source.js

import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

import { UserEntity } from "../entities/User.entity.js";
import { DoctorEntity } from "../entities/Doctor.entity.js";
import { AppointmentEntity } from "../entities/Appointment.entity.js";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",

  // 🟢 FORCE ENV VALUES (NO FALLBACK TO LOCALHOST)
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),

  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  // 🟢 IMPORTANT FIX (Supabase safe mode)
  synchronize: false,

  logging: true,

  // 🟢 Entities
  entities: [UserEntity, DoctorEntity, AppointmentEntity],

  // keep empty unless using migrations
  migrations: [],
  subscribers: [],

  // 🟢 Extra safety for Supabase connections
  ssl: {
    rejectUnauthorized: false
  }
});