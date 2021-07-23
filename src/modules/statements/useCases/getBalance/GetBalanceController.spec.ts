import { app } from "../../.././../app";
import request from "supertest";

import { Connection } from "typeorm";
import createConnection from "../../../../database";
import { hash } from "bcryptjs";
import { v4 } from "uuid";

let connection: Connection;

describe("Get Balance", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = v4();
    const password = await hash("test123", 8);

    await connection.query(
      `INSERT INTO users(id, name, email, password, created_at)
      VALUES('${id}', 'test', 'test@testmail.com', '${password}', 'now()' )`
    );

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "test@testmail.com",
      password: "test123",
    });

    const { token } = responseToken.body;

    await request(app).post(`/api/v1/statements/deposit`).send({
      amount: 10,
      description: "Test description",
    }).set({
      Authorization: `Bearer ${token}`,
    });
    
    await request(app).post(`/api/v1/statements/deposit`).send({
      amount: 100,
      description: "Test description",
    }).set({
      Authorization: `Bearer ${token}`,
    });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get statement balance", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "test@testmail.com",
      password: "test123",
    });

    const { token } = responseToken.body;

    const balance = await request(app).get(`/api/v1/statements/balance`).set({
      Authorization: `Bearer ${token}`,
    });

    expect(balance.status).toBe(200);
  });

  it("should not be able to get statement balance whitout autheticate", async () => {
    const balance = await request(app).get(`/api/v1/statements/balance`)

    expect(balance.status).toBe(401);
  });
})