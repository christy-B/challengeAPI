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

export const controllerTests = (req:Request, res:Response, next:NextFunction) => {
    try {
        const settings:ConnectConfig = req.body.connectConfig;
        const userId = req.body.user.id_user;
        const questions: IQuestionRO[]= req.body.questions;

        const score = allTests(settings, questions);

        response.json({
            id_score: score,
            score: score,
            user_foreign_key: userId,
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
    if(goodAnswer === (res?.response).replace("\n", "")) {
        score = question.question_score;
    } else {
        throw new Error("Not the right answer. Here is the output you gave "+ res.response)
    }
    return {
        stdIn:command,
        stdOut:res.response,
        errorCode:res.code,
        score:score
    }
}

// conn.connect(settings, async () => {
//     const test1 = await conn.exec(command);
//     console.log(test1);

//     const test2 = await conn.exec(command2);
//     console.log(test2);

// }).catch((err:stdOutError) => {
//     console.log(err)
// })