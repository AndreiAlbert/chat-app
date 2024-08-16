interface IUser {
    id: number;
    username: string;
    password: string;
}


export interface IMessage {
    id: number;
    content: string;
    timestamp: string,
    userId: number | null,
    user: IUser | null;
    chatRoomId: number;
    chatRoom: IChatRoom | null;
}


export interface IChatRoom {
    id: number;
    name: string;
    messages: IMessage[];
    users: IUser[];
}
