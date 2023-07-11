/**
 * A shell command to execute.
 */
export type shellCommand = string;

/**
 * Object that contains the code and the output of stdOut.
 */
export interface stdOutResponse {
    code: number,
    response: string
}

/**
 * Object that contains the code and the output of stdOut.
 */
export type stdOutError = Readonly<stdOutResponse>

/**
 * A callback that will call the tests to execute.
 */
export interface Callback {
    (): Promise<void>;
}