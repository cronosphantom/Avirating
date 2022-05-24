import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-my-friends',
  templateUrl: './my-friends.component.html',
  styleUrls: ['./my-friends.component.css']
})
export class MyFriendsComponent implements OnInit {

  friends = [];
  friend_page:number = 1;
  friend_more:boolean = true;

  constructor(
    private router: Router,
    public api: ApiService,
    private alert: IAlertService,
  ) { }

  ngOnInit(): void {
    this.api.getMyfriends({page: this.friend_page }).subscribe((resp: any) => {
      if (resp != null) {
       
        this.friends = resp.data
        if(resp.data.length<50)
          this.friend_more   = false
        else
          this.friend_more   = true
      } else {
        this.friends = []
        this.friend_more   = false
      }
      console.log(this.friends)
    })
  }

}
