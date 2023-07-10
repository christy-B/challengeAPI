import { Response, Request } from "express";
import { SshClient, stdOutError } from "./SshClient";
import { ConnectConfig } from "ssh2";
import {readFileSync} from "fs";

const settings:ConnectConfig = {
    host: '51.91.143.149',
    port: 22,
    username: 'ubuntu',
    password: "",
    privateKey: readFileSync("/root/.ssh/id_rsa")
}

export const tests = async (req:Request, res:Response, ) => {
    const command = 'cat text.txt';
    const conn = new SshClient();
    conn.connect(settings, async () => {
        const test1 = await conn.exec(command);
        console.log(test1);
        res.status(200).json({
            stdout:test1
        })
    
    }).catch((err:stdOutError) => {
        console.log(err);
        res.status(500).send(err)
    })
}