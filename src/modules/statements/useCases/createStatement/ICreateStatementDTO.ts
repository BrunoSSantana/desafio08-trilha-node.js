import { Statement } from "../../entities/Statement";

export type ICreateStatementDTO =
Pick<
  Statement,
  'received_id' |
  'description' |
  'amount' |
  'type'
>
