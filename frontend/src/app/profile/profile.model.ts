export interface UserInterface {
    name: string;
    email: string;
    password?: string;
}

export class User implements UserInterface {
    public name: string;
    public email: string;
    public password?: string;

    public constructor(jsonObject: any) {
        this.name = jsonObject.name;
        this.email = jsonObject.email;
    }
}