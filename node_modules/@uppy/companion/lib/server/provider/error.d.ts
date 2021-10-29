/**
 * AuthError is error returned when an adapter encounters
 * an authorization error while communication with its corresponding provider
 */
export class ProviderAuthError extends ProviderApiError {
    constructor();
}
/**
 * ProviderApiError is error returned when an adapter encounters
 * an http error while communication with its corresponding provider
 */
export class ProviderApiError extends Error {
    /**
     * @param {string} message error message
     * @param {number} statusCode the http status code from the provider api
     */
    constructor(message: string, statusCode: number);
    statusCode: number;
    isAuthError: boolean;
}
/**
 * Convert an error instance to an http response if possible
 *
 * @param {Error | ProviderApiError} err the error instance to convert to an http json response
 */
export function errorToResponse(err: Error | ProviderApiError): {
    code: number;
    message: string;
};
