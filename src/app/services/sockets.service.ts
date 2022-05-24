import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service'
import io from 'socket.io-client/dist/socket.io';
@Injectable({
  providedIn: 'root'
})
export class SocketsService {
  socket: io.Socket

  requests: any = []

  constructor(
    public api: ApiService,
  ) { 
    
  }

  createSocket(){
    this.socket = io.connect('https://api.avirating.com:5000');
    this.api.myAirportList = [];
    this.api.myGroupList = [];
  
    this.api.getSubscribedAirport().subscribe((resp: any) => {
      if (resp != null) {
        this.api.myAirportList = resp.data
        this.api.getMyGroupList({ my_search_content: '', page: 0 }).subscribe((resp: any) => {
          if (resp != null) {
            
            this.api.myGroupList = resp.data
            
            this.socket.on('new_post_alert', (data) => {
              
              if(data.post_type ==1){
                if((this.api.myAirportList.some(airportList => airportList.airport_id == data.airport_id))||(this.api.homeairport['airport_id'] == data.airport_id)){
                  const msg ="<span class='notification_span' style='font-weight: 600;font-size: 15px;text-transform: math-auto;'>"+ data.first_name+" "+ data.last_name+"</span> shared a post in <span class='notification_span' style='font-weight: 600;font-size: 15px;text-transform: math-auto;'>'"+data.airport_name+"'</span> airport";
                  this.api.notifications.push({'notification_msg':msg,'sender_id':data.user_id,'type':'new_post'})
                  this.api.newNotification++
                }
              }else{
                if((this.api.myGroupList.some(groupList => groupList.id == data.group_id))||(data.group_id ==0)){
                  const msg ="<span class='notification_span' style='font-weight: 600;font-size: 15px;text-transform: math-auto;'>"+ data.first_name+" "+ data.last_name+"</span> shared a post in <span class='notification_span' style='font-weight: 600;font-size: 15px;text-transform: math-auto;'>'"+data.group_name+"'</span> group";
                  this.api.notifications.push({'notification_msg':msg,'sender_id':data.user_id,'type':'new_post'})
                  this.api.newNotification++
                }
              }
              
            })

            this.socket.on('new_comment_alert', (data) => {
              if(data.post_type ==1){
                if(data.receiver_id == this.api.user.id){
                  const msg ="<span class='notification_span' style='font-weight: 600;font-size: 15px;text-transform: math-auto;'>"+ data.first_name+" "+ data.last_name+"</span> mentioned you in a post in <span class='notification_span' style='font-weight: 600;font-size: 15px;text-transform: math-auto;'>'"+data.airport_name+"'</span> airport";
                  this.api.notifications.push({'notification_msg':msg,'sender_id':data.user_id,'type':'new_comment'})
                  this.api.newNotification++
                }
              }else{
                if(data.receiver_id == this.api.user.id){
                  const msg ="<span class='notification_span' style='font-weight: 600;font-size: 15px;text-transform: math-auto;'>"+ data.first_name+" "+ data.last_name+"</span> mentioned you in a post in <span class='notification_span' style='font-weight: 600;font-size: 15px;text-transform: math-auto;'>'"+data.group_name+"'</span> group";
                  this.api.notifications.push({'notification_msg':msg,'sender_id':data.user_id,'type':'new_comment'})
                  this.api.newNotification++
                }
              }
              
            })

            this.socket.on('new_reply_alert', (data) => {

              if(data.receiver_id == this.api.user.id){
                const msg ="<span class='notification_span' style='font-weight: 600;font-size: 15px;text-transform: math-auto;'>"+ data.first_name+" "+ data.last_name+"</span> replied to your comment in <span class='notification_span' style='font-weight: 600;font-size: 15px;text-transform: math-auto;'>'"+data.group_name+"'</span> group";
                this.api.notifications.push({'notification_msg':msg,'sender_id':data.user_id,'type':'new_post'})
                this.api.newNotification++
              }
            })
          } 
        })
      }
    })
    
    this.socket.on('request', (data) => {
      this.api.newNotification++
    })
  }

}
