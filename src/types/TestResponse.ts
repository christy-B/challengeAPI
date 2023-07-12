import { shellCommand } from "./ssh/sshTypes"

export interface TestResponse {
    stdIn:shellCommand,
    stdOut:string,
    errorCode:number
    score:number
}