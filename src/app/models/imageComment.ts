export class imageComment {

    id = undefined;
    author = undefined;
    authord_id = undefined;
    comment: string = undefined;
    datetime = undefined;

    constructor(commentData: any = {}) {
        if (commentData) {
            this.id = commentData.id;
            this.author = commentData.author;
            this.authord_id = commentData.authord_id;
            this.comment = commentData.comment;
            this.datetime = commentData.datetime * 1000;
        }
    }

    public static serializeComments(obj: any = {}) {
        if (obj && obj.data) {
            let commentsData = obj.data;
            let comments: imageComment[] = [];

            for (let index = 0; index < commentsData.length; index++) {
                let newImageComment = new imageComment(commentsData[index]);
                comments.push(newImageComment);
            }

            return comments;
        }
    }
}