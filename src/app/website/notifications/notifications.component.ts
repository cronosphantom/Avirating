import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from 'src/app/services/api.service'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { FormBuilder } from '@angular/forms'
import { SocketsService } from 'src/app/services/sockets.service'
declare var $: any;

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class NotificationsComponent implements OnInit {

  request:any= []

  constructor(
    private fb: FormBuilder,
    public api: ApiService,
    private alert: IAlertService,
    public socketService : SocketsService,
  ) {

    this.api.getRequests().subscribe((resp: any) => {
      this.request = resp.data;
     
    })
    this.api.newNotification = 0;
  }

  ngOnInit(): void {
    this.socketService.socket.on('request', (data) => {
      if(data.receiver_id == this.api.user.id){
        this.request.push(data)
      }
    })
  }

  approveRequest(id: any, type: any, index: any): any {
    switch (type) {
      case 'join': {
        const param = {
          notification_id: id,
        }
        this.api.approveJoinRequest(param).subscribe((resp: any) => {
          this.request.splice(index, 1);
          if (this.api.newNotification > 0) this.api.newNotification--
          this.alert.success('approved')
        })
        break
      }
      case 'friend': {
        const param = {
          notification_id: id,
        }
        this.api.approveFriendRequest(param).subscribe((resp: any) => {
          this.request.splice(index, 1);
          if (this.api.newNotification > 0) this.api.newNotification--
          this.alert.success('approved')
        })
        break
      }
    }
  }

  rejectRequest(id: any, type: any, index: any): any {
    switch (type) {
      case 'join': {
        const param = {
          notification_id: id,
        }
        this.api.rejectJoinRequest(param).subscribe((resp: any) => {
          this.request.splice(index, 1);
          if (this.api.newNotification > 0) this.api.newNotification--
          this.alert.success('approved')
        })
        break
      }
      case 'friend': {
        const param = {
          notification_id: id,
        }
        this.api.rejectFriendRequest(param).subscribe((resp: any) => {
          this.request.splice(index, 1);
          if (this.api.newNotification > 0) this.api.newNotification--
          this.alert.success('approved')
        })
        break
      }
    }

  }

  getImageUrl(id: any) {
    return this.api.baseUrl + '/profile-image/' + id;
  }
}
