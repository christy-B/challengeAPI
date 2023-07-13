import { shellCommand } from "./ssh/sshTypes"
import { ConnectConfig } from "ssh2";
import { IUserRO } from "../model/IUser";
import { IQuestion } from "../model/IQuestion";

export interface TestResponse {
    stdIn:shellCommand,
    stdOut:string,
    errorCode:number
    score:number
}

export type ScoreTest = {
    connectConfig:ConnectConfig;
    user: IUserRO;
    questions: IQuestion[];
    id_score:number
  }
