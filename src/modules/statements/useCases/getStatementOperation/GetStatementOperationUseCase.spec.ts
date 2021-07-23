import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement of Operation", ()=> {
  const user: ICreateUserDTO = {
    email: "test@testmail.com",
    name: "Test",
    password: "test123",
  }

  const statement: ICreateStatementDTO = {
    amount: 100,
    description: "test",
    type: OperationType.DEPOSIT,
    user_id:""
  }
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  })
  it("should be able get operation byu id of user and id of statement", async () => {
    const newUser = await inMemoryUsersRepository.create({
      email: user.email,
      name: user.name,
      password: user.password,
    });

    const newStatement = await inMemoryStatementsRepository.create({
      amount: statement.amount,
      description: statement.description,
      type: statement.type,
      user_id: newUser.id as string,
    });
    await inMemoryStatementsRepository.create({
      amount: 1800,
      description: "test 02",
      type: OperationType.DEPOSIT,
      user_id: newUser.id as string,
    });

    const result = await getStatementOperationUseCase.execute({
      statement_id: newStatement.id as string,
      user_id: newUser.id as string,
    });

    expect(result.id).toEqual(newStatement.id);
  });

  it("should not be able get statement operation without id user", async () => {
    const newStatement = await inMemoryStatementsRepository.create({
      amount: statement.amount,
      description: statement.description,
      type: statement.type,
      user_id: "132",
    });

    expect(async ()=>{
      await getStatementOperationUseCase.execute({
        statement_id: newStatement.id as string,
        user_id: "132",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able get statement operation without id statement", () => {
    expect(async ()=>{
      const newUser = await inMemoryUsersRepository.create({
        email: user.email,
        name: user.name,
        password: user.password,
      });

      await inMemoryStatementsRepository.create({
        amount: 1800,
        description: "test 02",
        type: OperationType.DEPOSIT,
        user_id: newUser.id as string,
      });

      await getStatementOperationUseCase.execute({
        statement_id: "",
        user_id: newUser.id as string,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});