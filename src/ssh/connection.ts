import {readFileSync} from "fs";
import {SshClient} from "./SshClient";
import { ConnectConfig } from "ssh2";
import {stdOutError} from "./SshClient";

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

conn.connect(settings, async () => {
    const test1 = await conn.exec(command);
    console.log(test1);

    const test2 = await conn.exec(command2);
    console.log(test2);

}).catch((err:stdOutError) => {
    console.log(err)
})
