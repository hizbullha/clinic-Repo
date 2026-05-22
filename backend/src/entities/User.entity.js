import { EntitySchema } from "typeorm";
export const UserEntity = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    username: {
      type: "varchar",
      length: 50,
      unique: true,
      nullable: false,
    },
    password_hash: {
      type: "text",
      nullable: false,
    },
    name: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    role: {
      type: "varchar",
      length: 20,
      nullable: false,
    },
  },
});