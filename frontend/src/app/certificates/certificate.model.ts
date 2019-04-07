export class Certificate {
    public name: string;
    public pk: number;
    public subject_email: string;
    public user: string;
    public revoked: boolean;

    public constructor(jsonObject: any) {
        this.name = jsonObject.name;
        this.pk = jsonObject.pk;
        this.subject_email = jsonObject.subject_email;
        this.user = jsonObject.user;
        this.revoked = jsonObject.revoked;
    }
}