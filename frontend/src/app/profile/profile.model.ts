interface UserInterface {
    firstname: string;
    lastname: string;
    email: string;
}

export class User implements UserInterface {
    public firstname: string;
    public lastname: string;
    public email: string;

    public constructor(jsonObject: any) {
        this.firstname = jsonObject.firstname;
        this.lastname = jsonObject.lastname;
        this.email = jsonObject.email;
    }
}
