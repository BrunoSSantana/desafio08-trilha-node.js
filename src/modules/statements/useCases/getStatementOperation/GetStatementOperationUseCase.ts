import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";

interface IRequest {
  received_id: string;
  statement_id: string;
}

@injectable()
export class GetStatementOperationUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ received_id, statement_id }: IRequest) {
    const user = await this.usersRepository.findById(received_id);

    if(!user) {
      throw new GetStatementOperationError.UserNotFound();
    }

    const statementOperation = await this.statementsRepository
      .findStatementOperation({ received_id, statement_id });

      if(!statementOperation) {
        throw new GetStatementOperationError.StatementNotFound();
      }

      return statementOperation;
  }
}
