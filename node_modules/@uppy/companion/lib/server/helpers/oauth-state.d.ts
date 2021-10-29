export function generateState(secret: any): string;
export function addToState(state: any, data: any, secret: any): string;
export function getFromState(state: any, name: any, secret: any): any;
export function getDynamicStateFromRequest(req: any): any;
