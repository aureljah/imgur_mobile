export class accountInfo {
    username = undefined;
    id = undefined;
    url = undefined;
    bio = undefined;
    avatar = undefined;
    reputation = undefined;
    reputation_name = undefined;
    created = undefined;
    pro_expiration = undefined;


    constructor(username: string, obj: any = {}) {
        if (obj && obj.data) {
            let data = obj.data;

            this.username = username;
            this.id = data.id;
            this.url = data.url;
            this.bio = data.bio;
            this.avatar = data.avatar;
            this.reputation = data.reputation;
            this.reputation_name = data.reputation_name;
            this.created = data.created;
            this.pro_expiration = data.expiration;
        }
    }
}