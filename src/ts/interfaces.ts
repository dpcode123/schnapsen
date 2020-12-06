export interface User {
    id: number,
    username: string,
    email: string,
    password: string,
    cardface_design_id: number,
    cardback_design_id: number,
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

export interface RegisterError {
    message: string;
};