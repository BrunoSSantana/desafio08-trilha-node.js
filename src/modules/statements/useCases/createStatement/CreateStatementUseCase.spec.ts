import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", ()=> {
  const user: ICreateUserDTO = {
    email: "test@testmail.com",
    name: "Test",
    password: "test123"
  }
  beforeEach( ()=>{
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository, 
      inMemoryStatementsRepository
    )
  });
  it("should be able create a new deposit", async () => {
    const newUser = await inMemoryUsersRepository.create(user);

    const deposit = await createStatementUseCase.execute({
      amount: 100,
      description: "test",
      type: OperationType.DEPOSIT,
      user_id: newUser.id as string,
    });
    expect(deposit).toHaveProperty("id");
  })
  it("should be able create a new withdraw", async () => {
    const newUser = await inMemoryUsersRepository.create(user);

    await createStatementUseCase.execute({
      amount: 100,
      description: "test",
      type: OperationType.DEPOSIT,
      user_id: newUser.id as string,
    });

    const withdraw = await createStatementUseCase.execute({
      amount: 50,
      description: "test",
      type: OperationType.WITHDRAW,
      user_id: newUser.id as string,
    });

    expect(withdraw).toHaveProperty("id");
  });

  it("should not be able to create a new withdrawal without enough greeting", async () => {
    expect(async() => {
      const newUser = await inMemoryUsersRepository.create({
        email: user.email,
        name: user.name,
        password: user.password,
      })
      await createStatementUseCase.execute({
        amount: 100,
        description: "test",
        type: OperationType.WITHDRAW,
        user_id: newUser.id as string,
      })
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
  it("should not be able to create a new statement with non-existent user", () => {
    expect(async() => {
      await createStatementUseCase.execute({
        amount: 100,
        description: "test",
        type: OperationType.WITHDRAW,
        user_id: "newUser",
      })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })
})