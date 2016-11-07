interface UserInterface {
    first_name: string;
    last_name: string;
    email: string;
}

export class User implements UserInterface {
    public first_name: string;
    public last_name: string;
    public email: string;

    public constructor(jsonObject: any) {
        this.first_name = jsonObject.firstname;
        this.last_name = jsonObject.lastname;
        this.email = jsonObject.email;
    }
}
