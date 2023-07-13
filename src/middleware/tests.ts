import {readFileSync} from "fs";
import { SshClient } from "../utility/SshClient";
import { ConnectConfig } from "ssh2";
import { stdOutError } from "../types/ssh/sshTypes";
import { IQuestion } from "../model/IQuestion";
import { shellCommand } from "../types/ssh/sshTypes";
import { Response, Request, NextFunction, response } from "express";
import { TestResponse } from "../types/TestResponse";
import { IScore } from "../model/IScore";
import { DB } from "../utility/DB";
import { IUser, IUserRO } from "../model/IUser";
import { RowDataPacket } from "mysql2";
import { error } from "ajv/dist/vocabularies/applicator/dependencies";

let settings:ConnectConfig = {
    host: '',
    port: 22,
    username: '',
    password: "",
    privateKey: readFileSync("/root/.ssh/id_rsa")
}

const conn = new SshClient();

export const controllerTests = async (req:Request, res:Response, next:NextFunction) => {
    try {
        settings = req.body.connectConfig;
        const userId = req.body.user.id_user;
        const scoreId = req.body.id_score;
        const questions = req.body.questions;

        const score = await allTests(settings, questions, userId).then(res => res).catch((err) => {
            throw err;
        });

        const res:IScore = {
            id_score: scoreId,
            score: score,
            user_foreign_key: userId,
        }

        req.body = res;

        next();

    } catch (error) {
        next(error)
    }
}

const allTests = async (settings:ConnectConfig, questions:IQuestion[], userId:number)=> {

    settings.privateKey = readFileSync("/root/.ssh/id_rsa");

    let score = 0;

    try {
        conn.connect(settings, async () => {

            const userQuery = await searchName(userId).catch((error) => {
                throw error;
            });
    
            const fullname = `${userQuery.prenom_user} ${userQuery.nom_user}`
    
            // test nom de la personne pour vérifier qu'elle bosse bien sur son compte utilisateur à elle même si elle partage une instance avec quelqu'un
            
            console.log(fullname)
            let cheat = false;
            // const res = await conn.exec('cat name.text').then((res)=> {
            //     try {
            //         if (res.response !== fullname) {
            //             cheat = true 
            //             console.log(cheat)
            //         } else {score += 1;}
            //     } catch (error) {
            //         throw error
            //     }
            // }).catch((err) => {
            //     console.log("catch")
            //     console.log(err);
            // });
    
            if(cheat) throw new Error("Veuillez écrire votre nom comme-ci 'nom prenom' dans un fichier nommé name.text, \n situé à la racine du compte utilisateur que vous avez donné précédemment")
            
            for (const question of questions) {
                const test = await doTest(question).then(res => res).catch((err) => {
                    throw err;
                });
    
                if (test.errorCode !== 0) {
                    throw new Error(JSON.stringify(test));
                } else {
                    score += test.score;
                }
            }        
        
        }).catch((err:stdOutError) => {
            throw(err)
        })
    } catch (error) {
        throw error
    }

    return score
}

const doTest = (question:IQuestion):Promise<TestResponse> => {
    return new Promise<TestResponse>(async (resolve, reject) => {
        const command:shellCommand = question.question_text;
        const goodAnswer = question.bonne_reponse;
        conn.exec(command).then( (res) => {
            let score = 0;
            if(goodAnswer === (res.response).replace("\n", "") ) {
                score = question.question_score;
            } else {
                reject (new Error("Not the right answer. Here is the output you gave : "+ res.response))
            }
            resolve({
                stdIn:command,
                stdOut:res.response,
                errorCode:res.code,
                score:score
            })            
        }).catch((err) => {
            reject(err);
        });
    })
}

const searchName = (userId:number) => {
    return new Promise<IUser>(async (resolve, reject) => {

      // ATTENTION ! Valider que le userId est valable ?

      const db = DB.Connection;

      // Récupérer les lignes
      const data = await db.query<IUserRO[] & RowDataPacket[]>("select id_user, nom_user, prenom_user, email_user, scope, id_promo from USER where id_user = ?", [userId]);

      // Construire la réponse

      // ATTENTION ! Que faire si le nombre de lignes est zéro ?

      resolve(data[0][0])         
    })

  }