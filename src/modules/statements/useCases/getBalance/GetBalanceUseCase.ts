import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";

interface IRequest {
  received_id: string;
}

interface IResponse {
  statement: Statement[];
  balance: number;
}

@injectable()
export class GetBalanceUseCase {
  constructor(
    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository,

    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({ received_id }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(received_id);

    if (!user) {
      throw new GetBalanceError();
    }

    const balance = await this.statementsRepository.getUserBalance({
      received_id,
      with_statement: true,
    });

    return balance as IResponse;
  }
}
