import {readFileSync} from "fs";
import { SshClient } from "../utility/SshClient";
import { ConnectConfig } from "ssh2";
import { stdOutError } from "../types/ssh/sshTypes";
import { IQuestion } from "../model/IQuestion";
import { shellCommand } from "../types/ssh/sshTypes";

const settings:ConnectConfig = {
    host: '51.91.143.149',
    port: 22,
    username: 'ubuntu',
    password: "",
    privateKey: readFileSync("/root/.ssh/id_rsa")
}

interface testAnswer {
    stdIn:shellCommand,
    stdOut:string,
    errorCode:number
    score:number
}

const command = 'cat text.txt';
const command2 = 'cat test.txt';

const conn = new SshClient();

const doTests = async (settings:ConnectConfig, questions:IQuestion[])=> {

    settings.privateKey = readFileSync("/root/.ssh/id_rsa");

    let score = 0;

    for (const question of questions) {
        
    }
}

const test = async (question:IQuestion):Promise<testAnswer> => {
    const command:shellCommand = question.question_text;
    const goodAnswer = question.bonne_reponse;
    const res = await conn.exec(command);
    let score = 0;
    if(goodAnswer === res?.response) {
        score = question.question_score
    }
    return {
        stdIn:command,
        stdOut:res.response,
        errorCode:res.code,
        score:score
    }
}

conn.connect(settings, async () => {
    const test1 = await conn.exec(command);
    console.log(test1);

    const test2 = await conn.exec(command2);
    console.log(test2);

}).catch((err:stdOutError) => {
    console.log(err)
})