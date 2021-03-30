import { v4 as uuid } from 'uuid';
import { JSONArrayOf, JSONValue } from '../../json';

export interface JSONRPCRequestOptions {
    func: string,
    params: any,
    timeout?: number,
    token?: string;
}

// The JSON RPC Request parameters
// // An array of  JSON objects
// export interface JSONRPCParam {
//     [key: string]: JSONValue;
// }

// The entire JSON RPC request object
export interface JSONRPCRequest {
    method: string,
    jsonrpc: '2.0',
    id: string,
    params: JSONArrayOf<JSONValue>,
}

export interface JSONRPCErrorInfo {
    code: string,
    status?: number,
    message: string,
    detail?: string;
    data?: any;
}

// export class JSONRPCError extends Error {
//     code: string;
//     message: string;
//     detail?: string;
//     data?: any;
//     constructor(errorInfo: JSONRPCErrorInfo) {
//         super(errorInfo.message);
//         this.name = 'JSONRPCError';

//         this.code = errorInfo.code;
//         this.message = errorInfo.message;
//         this.detail = errorInfo.detail;
//         this.data = errorInfo.data;
//         this.stack = (<any>new Error()).stack;
//     }
// }

export interface JSONRPCClientParams {
    url: string,
    timeout: number;
    token?: string;
}

export interface JSONPayload {
    jsonrpc: '2.0';
    method: string;
    id: string;
    params: JSONArrayOf<JSONValue>;
}

export interface JSONRPC20Error {
    name: string;
    code: number;
    message: string;
    error: JSONValue;
}

export type JSONRPCError = JSONRPC20Error;

export class JSONRPC20Exception extends Error {
    error: JSONRPC20Error;
    constructor(error: JSONRPCError) {
        super(error.message);
        this.error = error;
    }
}

export interface JSONRPCResponseResult {
    result: JSONArrayOf<JSONValue>;
    error: null;
}

export interface JSONRPCResponseError {
    result: null;
    error: JSONRPC20Error;
}

export type JSONRPCResponse = JSONRPCResponseResult | JSONRPCResponseError;

export class JSONRPCClient {
    url: string;
    timeout: number;
    token?: string;
    constructor({ url, timeout, token }: JSONRPCClientParams) {
        this.url = url;
        this.timeout = timeout;
        this.token = token;
    }

    protected makePayload(method: string, params: JSONArrayOf<JSONValue>): JSONPayload {
        return {
            jsonrpc: '2.0',
            method,
            id: uuid(),
            params
        };
    }

    async callMethod(method: string, params: JSONArrayOf<JSONValue>, { timeout }: { timeout?: number; } = {}): Promise<JSONArrayOf<JSONValue>> {
        const payload = this.makePayload(method, params);
        const headers = new Headers();
        headers.set('content-type', 'application/json');
        headers.set('accept', 'application/json');
        if (this.token) {
            headers.set('authorization', this.token);
        }

        // TODO: timeout, cancellation
        const response = await fetch(this.url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers
        });

        const result = await (async () => {
            const responseText = await response.text();

            try {
                return JSON.parse(responseText) as JSONArrayOf<JSONValue>;
            } catch (ex) {
                console.error('error', ex);
                throw new JSONRPC20Exception({
                    name: 'parse error',
                    code: 100,
                    message: 'The response from the service could not be parsed',
                    error: {
                        originalMessage: ex.message,
                        responseText
                    }
                });
            }
        })();

        if (result.hasOwnProperty('error')) {
            const errorResult = (result as unknown) as JSONRPCResponseError;
            throw new JSONRPC20Exception({
                name: errorResult.error.name,
                code: errorResult.error.code,
                message: errorResult.error.message,
                error: errorResult.error.error
            });
        }

        const rpcResponse = (result as unknown) as JSONRPCResponseResult;
        return rpcResponse.result;


    }
}