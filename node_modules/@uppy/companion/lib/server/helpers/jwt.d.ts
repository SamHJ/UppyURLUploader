export function generateToken(payload: any, secret: string): string;
export function verifyToken(token: string, secret: string): {
    payload: any;
    err?: undefined;
} | {
    err: any;
    payload?: undefined;
};
export function generateEncryptedToken(payload: any, secret: string): string;
export function verifyEncryptedToken(token: string, secret: string): {
    payload: any;
    err?: undefined;
} | {
    err: any;
    payload?: undefined;
};
export function addToCookies(res: object, token: string, companionOptions: object, authProvider: string): void;
export function removeFromCookies(res: object, companionOptions: object, authProvider: string): void;
