export class accountInfo {
    username: string = undefined;

    constructor(obj: any = {}) {
        if (obj) {
            this.username = obj.username;
        }
    }
}