import { Client, ConnectConfig } from "ssh2";

/**
 * A shell command to execute.
 */
type shellCommand = string;
/**
 * A callback that will call the tests to execute.
 */
interface Callback {
    (): Promise<void>;
}

/**
 * Object that contains the code and the output of stdOut.
 */
export interface stdOutResponse {
    code?: number,
    response?: string
}

/**
 * Object that contains the code and the output of stdOut.
 */
export type stdOutError = Readonly<stdOutResponse>

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
                    reject(err.message);
                })
                .on("ready", () => {
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
        return new Promise<stdOutResponse|null>((resolve, reject) => {
            this.conn.exec(stdIn, (err, stream) => {
                if (err) reject(err);
                let res:stdOutResponse = {};
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