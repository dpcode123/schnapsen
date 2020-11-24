export interface User {
    id: number,
    username: string,
}

export interface Player extends User{
    socketId?: string,
}

export interface CustomRequest extends Express.Request { 
    body: any;
    session: any;
    query: any;
} 

export interface CustomResponse extends Express.Response {
    render(page: string, b?: any): void;
    redirect(url: string): void;
    status(statusCode: number): any;
}