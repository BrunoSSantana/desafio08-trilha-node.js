import { app } from "../../../../app";
import request from "supertest";
import { Connection } from "typeorm";

import createConnection from "../../../../database";
import { v4 } from "uuid";
import { hash } from "bcryptjs";

let connection: Connection;

describe("Get Statement Operation", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = v4();

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

  it("should be able to get a statement operation", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "test@testmail.com",
      password: "test123",
    });

    const { token } = responseToken.body;
    
    const responseStatement = await request(app).post(`/api/v1/statements/deposit`).send({
      amount: 100,
      description: "Test description",
    }).set({
      Authorization: `Bearer ${token}`,
    });

    await request(app).post(`/api/v1/statements/deposit`).send({
      amount: 200,
      description: "Test description 02",
    }).set({
      Authorization: `Bearer ${token}`,
    });

    const statement_id = responseStatement.body.id;
    
    const response = await request(app).get(`/api/v1/statements/${statement_id}`).set({
      Authorization: `Bearer ${token}`,
    });
    
    expect(response.status).toBe(200)
  });
  it("should not be able to get a statement operation for statement non-exist", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "test@testmail.com",
      password: "test123",
    });

    const { token } = responseToken.body;
    
    const statement_id = "658ea339-98be-4d50-ae66-ce18dfe7b9b9"
    
    const response = await request(app).get(`/api/v1/statements/${statement_id}`).set({
      Authorization: `Bearer ${token}`,
    });
    
    expect(response.status).toBe(404)
  });

  it("should not be able to get a statement operation without token", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "test@testmail.com",
      password: "test123",
    });

    const { token } = responseToken.body;
    
    const responseStatement = await request(app).post(`/api/v1/statements/deposit`).send({
      amount: 100,
      description: "Test description",
    }).set({
      Authorization: `Bearer ${token}`,
    });

    await request(app).post(`/api/v1/statements/deposit`).send({
      amount: 200,
      description: "Test description 02",
    }).set({
      Authorization: `Bearer ${token}`,
    });

    const statement_id = responseStatement.body.id;
    
    const response = await request(app).get(`/api/v1/statements/${statement_id}`);

    expect(response.status).toBe(401)
  });
});
