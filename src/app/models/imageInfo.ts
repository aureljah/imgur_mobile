export class imageInfo {
    link: string;
    account_url: string; // username who posted it
    title: string;
    description: string;

    ups: number;
    downs: number;
    views: number;
    comment_count: number;

    vote: boolean; // if connected user has voted
    animated: boolean = false; // true if contains video
    images: {
        link: string;
        description: string;
    }[] = [];

    constructor(obj: any = {}) {
        if (obj) {
            this.link = obj.link;
            this.account_url = obj.account_url;
            this.title = obj.title;
            this.description = obj.description;

            this.ups = obj.ups;
            this.downs = obj.downs;
            this.views = obj.views;
            this.comment_count = obj.comment_count;

            this.vote = obj.vote;

            if (obj.animated === true) {
                this.animated = true;
            }

            if (obj.images && obj.images_count > 0) {
                for (let i = 0 ; i < obj.images.length ; i++) {
                    let img = obj.images[i];

                    if (i === 0) {
                        this.link = img.link;
                    }

                    this.images.push({link: img.link, description: img.description})
                    if (img.animated === true) {
                        this.animated = true;
                    }
                }
            }
        }
    }
}


/*
All data exemple:
account_id: 23603129
account_url: "OctopussSevenTwo"
ad_config:
highRiskFlags: []
safeFlags: (3) ["in_gallery", "sixth_mod_safe", "gallery"]
showsAds: true
unsafeFlags: []
wallUnsafeFlags: []
__proto__: Object
ad_type: 0
ad_url: ""
animated: false
bandwidth: 3371924808
comment_count: 227
datetime: 1607608907
description: null
downs: 29
edited: 0
favorite: false
favorite_count: 206
has_sound: false
height: 1307
id: "t1LapFd"
in_gallery: true
in_most_viral: true
is_ad: false
is_album: false
link: "https://i.imgur.com/t1LapFd.jpg"
nsfw: false
points: 2574
score: 2590
section: ""
size: 103726
tags: (3) [{…}, {…}, {…}]
title: "One can dream..."
topic: "No Topic"
topic_id: 29
type: "image/jpeg"
ups: 2603
views: 32508
vote: null
width: 1000
*/