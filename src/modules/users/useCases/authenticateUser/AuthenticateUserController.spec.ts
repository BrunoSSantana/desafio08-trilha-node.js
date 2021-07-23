import { app } from "../../../../app";
import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4} from "uuid";

import createConnection from "../../../../database/"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let connection: Connection;

describe("Authenticate User", () => {

  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();
    
    const id = uuidV4();

    const password = await hash("test123", 8)

    await connection.query(
      `INSERT INTO users(id, name, email, password, created_at)
      VALUES('${id}', 'test', 'test@testmail.com', '${password}', 'now()' )`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate a user", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "test@testmail.com",
      password: "test123",
    });
    
    expect(response.body).toHaveProperty("token")
    expect(response.status).toBe(200)
  });
  it("should not be able to authenticate with email incorrect or non-existent user", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "test02@testmail.com",
      password: "test123",
    });

    // expect(response).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    expect(response.status).toBe(401)
  });
  it("should not be able to authenticate with password incorrect", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "test@testmail.com",
      password: "testIncorrect",
    });

    expect(response.text).toEqual("{\"message\":\"Incorrect email or password\"}")
    expect(response.status).toBe(401)
  });
});