interface IUser {
    id: number;
    username: string;
    password: string;
}


interface IMessage {
    id: number;
    content: string;
    timeStamp: string,
    userId: number,
    user: IUser;
    chatRoomId: number;
    chatRoom: string;
}


export interface IChatRoom {
    id: number;
    name: string;
    messages: IMessage[];
    users: IUser[];
}
