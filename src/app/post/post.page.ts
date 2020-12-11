import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { imageInfo } from '../models/imageInfo';
import { ImgurApiService } from '../services/imgur-api.service';


@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {

  image: imageInfo = undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public imgurApiService: ImgurApiService,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.image = this.router.getCurrentNavigation().extras.state.image;
      }
    });
  }

}
