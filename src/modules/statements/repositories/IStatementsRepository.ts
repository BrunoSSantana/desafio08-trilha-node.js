import { ICreateOperationDTO } from "../dtos/ICreateOperationDTO";
import { Statement } from "../entities/Statement";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../useCases/getStatementOperation/IGetStatementOperationDTO";

export interface IStatementsRepository {
  create: (data: ICreateOperationDTO) => Promise<Statement>;
  findStatementOperation: (
    data: IGetStatementOperationDTO
  ) => Promise<Statement | undefined>;
  getUserBalance: (
    data: IGetBalanceDTO
  ) => Promise<
    { balance: number } | { balance: number; statement: Statement[] }
  >;
}
