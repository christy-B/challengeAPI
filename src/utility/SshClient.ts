import { Client, ConnectConfig } from "ssh2";
import { stdOutError,stdOutResponse, shellCommand, Callback} from "../types/ssh/sshTypes";

/**
 * A wrapper class for the ssh2 library.
 */
export class SshClient {

    private conn: Client;

    constructor() {
        this.conn = new Client();
    }

    connect(settings: ConnectConfig, instructions: Callback) {
        return new Promise<void>((resolve, reject) => {
            this.conn
                .on("error", (err:Error)=> {
                    console.log(err)
                    reject(err.message);
                })
                .on("ready", () => {
                    console.log("ssh ready")
                    instructions()
                .then(() => {
                    resolve();
                })
                .catch((err:stdOutError) => {
                    reject(err);
                })
                .finally(() => {
                    this.conn.end();
                })
            }).connect(settings)
        })
    }

    exec(stdIn: shellCommand) {
        return new Promise<stdOutResponse>((resolve, reject) => {
            this.conn.exec(stdIn, (err, stream) => {
                console.log(err)
                if (err) reject(err);
                let res:stdOutResponse = {code:0, response:""};
                stream.on("close", (code:number) => {
                    res.code = code;
                    if(code !== 0) reject(res);
                    resolve(res);
                }).on('data', (data: Buffer) => {
                    res.response = data.toString();
                }).stderr.on('data', (data: Buffer) => {
                    // console.log('STDERR: ' + data);
                    // if parts of the error message is lost it is happening here
                    res.response = data.toString();
                });
            })
        })
    }

}