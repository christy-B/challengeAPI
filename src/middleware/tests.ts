import {readFileSync} from "fs";
import { SshClient } from "../utility/SshClient";
import { ConnectConfig } from "ssh2";
import { stdOutError } from "../types/ssh/sshTypes";
import { IQuestion } from "../model/IQuestion";
import { shellCommand } from "../types/ssh/sshTypes";
import { Response, Request, NextFunction, response } from "express";
import { TestResponse } from "../types/TestResponse";
import { IUser } from "../model/IUser";
import { IQuestionRO } from "../model/IQuestion";

const settings:ConnectConfig = {
    host: '51.91.143.149',
    port: 22,
    username: 'ubuntu',
    password: "",
    privateKey: readFileSync("/root/.ssh/id_rsa")
}

const command = 'cat text.txt';
const command2 = 'cat test.txt';

const conn = new SshClient();

export const controllerTests = (reqUser:Request, reqQuestions:Request, res:Response, next:NextFunction) => {
    try {
        const settings:ConnectConfig = reqUser.body.setttings;
        const user:IUser = reqUser.body.user;
        const questions: IQuestionRO[]= reqQuestions.body.data;

        const score = allTests(settings, questions);

        response.json({
            score: score,
            // RECUP ID SCORE
            id_score: 1,
            id_user: user.id_user
        })

    } catch (error) {
        next(error)
    }
}

const allTests = async (settings:ConnectConfig, questions:IQuestion[])=> {

    settings.privateKey = readFileSync("/root/.ssh/id_rsa");

    let score = 0;

    for (const question of questions) {
        const test = await doTest(question);

        if (test.errorCode !== 0) {
            throw new Error(JSON.stringify(test));
        } else {
            score += test.score;
        }
    }

    return score
}

const doTest = async (question:IQuestion):Promise<TestResponse> => {
    const command:shellCommand = question.question_text;
    const goodAnswer = question.bonne_reponse;
    const res = await conn.exec(command);
    let score = 0;
    if(goodAnswer === res?.response) {
        score = question.question_score;
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