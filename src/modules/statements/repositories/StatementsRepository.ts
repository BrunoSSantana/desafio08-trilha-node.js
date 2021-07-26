import { getRepository, Repository } from "typeorm";

import { ICreateOperationDTO } from "../dtos/ICreateOperationDTO";
import { Statement } from "../entities/Statement";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../useCases/getStatementOperation/IGetStatementOperationDTO";
import { IStatementsRepository } from "./IStatementsRepository";

export class StatementsRepository implements IStatementsRepository {
  private repository: Repository<Statement>;

  constructor() {
    this.repository = getRepository(Statement);
  }

  async create({
    received_id,
    send_id = null,
    amount,
    description,
    type,
  }: ICreateOperationDTO): Promise<Statement> {
    const statement = this.repository.create({
      received_id,
      send_id,
      amount,
      description,
      type,
    });

    return this.repository.save(statement);
  }

  async findStatementOperation({
    statement_id,
  }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    const statements = await this.repository.findOne(statement_id, {
      where: { id: statement_id },
    });

    return statements;
  }

  async getUserBalance({
    received_id,
    with_statement = false,
  }: IGetBalanceDTO): Promise<
    { balance: number } | { balance: number; statement: Statement[] }
  > {
    const statement = await this.repository.find({
      where: [{ received_id }, { send_id: received_id }],
    });

    const balance = statement.reduce((acc, operation) => {
      if (
        operation.type === "withdraw" ||
        (operation.type === "transfer" && operation.send_id === received_id)
      ) {
        return acc - Number(operation.amount);
      }

      return acc + Number(operation.amount);
    }, 0);

    if (with_statement) {
      return {
        statement,
        balance,
      };
    }

    return { balance };
  }
}
