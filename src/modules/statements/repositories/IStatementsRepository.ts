import { Statement } from "../entities/Statement";
import { ICreateOperationDTO } from "../dtos/ICreateOperationDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../useCases/getStatementOperation/IGetStatementOperationDTO";

export interface IStatementsRepository {
  create: (data: ICreateOperationDTO) => Promise<Statement>;
  getUserBalance: (
    data: IGetBalanceDTO
  ) => Promise<
    { balance: number } | { balance: number; statement: Statement[] }
  >;
}
