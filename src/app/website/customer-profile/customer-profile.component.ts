import { Component, OnInit,TemplateRef } from '@angular/core';
import { Router } from '@angular/router'
import { ApiService } from 'src/app/services/api.service'
import { ActivatedRoute } from '@angular/router';
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { Lightbox } from 'ngx-lightbox'
import { BsModalRef ,BsModalService} from 'ngx-bootstrap/modal'
import { SocketsService } from 'src/app/services/sockets.service';
@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css']
})
export class CustomerProfileComponent implements OnInit {
  airport_name: any
  customer_posts:any = []
  customer_replies:any = []
  customer_likes:any = []
  customer_airports:any = []
  customer_images:any =[]
  customer_videos:any =[]
  customer_reviews: any = []
  albums: Array<any> = []

  customer_id: any
  customer_first_name: any
  customer_last_name: any
  customer_info: any
  customer_aircraft_type: any
  customer_aircraft_tail_number: any
  customer_dob: any
  customer_address: any
  customer_contact_1: any
  customer_contact_2: any
  customer_friend_state: any

  posts_cnt: any
  replies_cnt: any
  likes_cnt: any
  tab_state: any

  post_page:number =1
  reply_page:number =1
  like_page:number =1
  airpark_page:number = 1
  review_page:number = 1
  airport_page:number = 1;

  post_more:boolean = true
  reply_more:boolean = true
  like_more:boolean = true
  airpark_more:boolean = true
  review_more:boolean = true
  airport_more:boolean = true;


  videoModalRef: BsModalRef

  modal_video_url:any

  constructor(
    public api: ApiService,
    public route: ActivatedRoute,
    private alert: IAlertService,
    private router: Router,
    private lightbox: Lightbox,
    private modalService: BsModalService,
    public socketService : SocketsService,
  ) {
    this.customer_id = this.route.snapshot.paramMap.get('customer_id')
    this.api.getCustomerInfo({ customer_id: this.customer_id }).subscribe((resp: any) => {
      this.customer_info = resp.data
      this.customer_first_name = this.customer_info.first_name
      this.customer_last_name = this.customer_info.last_name
      this.customer_aircraft_type = this.customer_info.aircraft_type
      this.customer_aircraft_tail_number = this.customer_info.aircraft_tail_number
      // this.customer_dob = this.customer_info.dob
      this.customer_address = this.customer_info.address
      this.customer_contact_1 = this.customer_info.contact_1
      this.customer_contact_2 = this.customer_info.contact_2
      this.customer_friend_state  = this.customer_info.friend_state
      this.tab_state = 1;

    this.api.getAirportName({ airport_id: this.customer_info.home_airport }).subscribe((resp: any) => {
        this.airport_name = resp.data
      })
    })

    this.api.getActivityInfo({ customer_id: this.customer_id }).subscribe((resp: any) => {
      this.posts_cnt = resp.data.posts_cnt
      this.replies_cnt = resp.data.replies_cnt
      this.likes_cnt = resp.data.likes_cnt
    })

    this.api.getCustomerPosts({ customer_id: this.customer_id, page: this.post_page }).subscribe((resp: any) => {
      this.customer_posts = resp.data
      if(this.customer_posts.length<5)
        this.post_more   = false
    })

    this.api.getCustomerReplies({ customer_id: this.customer_id,page: this.reply_page }).subscribe((resp: any) => {
      this.customer_replies = resp.data
      if(this.customer_replies.length<5)
        this.reply_more   = false
    })

    this.api.getCustomerLikes({ customer_id: this.customer_id,page: this.like_page }).subscribe((resp: any) => {
      this.customer_likes = resp.data
      if(this.customer_likes.length<5)
        this.like_more   = false
    })

  }

  ngOnInit(): void {

    this.api.getCustomerReviews({ customer_id: this.customer_id, page: this.review_page }).subscribe((resp: any) => {
      this.customer_reviews = resp.data
      if(this.customer_reviews.length<5)
        this.review_more   = false
    })

    this.api.getCustomerAirports({ customer_id: this.customer_id, page: this.airport_page }).subscribe((resp: any) => {
      if (resp != null) {
        this.customer_airports = resp.data
        if(resp.data.length<15)
          this.airport_more   = false
        else
          this.airport_more   = true
      } else {
        this.customer_airports = []
        this.airport_more   = false
      }
    })

    


    this.api.getCustomerImages({ customer_id: this.customer_id}).subscribe((resp: any) => {

      for(let i=0; i<resp.data.length;i++){
    
        if(resp.data[i].image_cnt > 0){
          for(let j=1; j<=resp.data[i].image_cnt;j++){
            
            this.customer_images.push({'post_id':resp.data[i].id,'post_content':resp.data[i].post_content,'image_name':resp.data[i].id + '_' + j,'type':'image'})
          }
        }
        
      }

    })

    this.api.getCustomerVideos({ customer_id: this.customer_id }).subscribe((resp: any) => {

      for(let i=0; i<resp.data.length;i++){
    
        
        if(resp.data[i].video_cnt > 0){
          this.customer_videos.push({'post_id':resp.data[i].id,'post_content':resp.data[i].post_content,'video_name':resp.data[i].id,'type':'video'})
        }
      }

    })
    
  }

  
  getUserImageUrl(data: any): string {
    return this.api.baseUrl + '/profile-image/' + data
  }

  getPostThumbImageUrl(data: any): string {
    return this.api.baseUrl + '/post-img-thumb/' + data
  }

  getPostThumbVideoUrl(data: any): string {
    return this.api.baseUrl + '/post-video-thumb/' + data
  }

  transform(differencevalue: any): any {
    if (differencevalue) {
      // const seconds = Math.floor((+new Date() - +new Date(differencevalue)) / 1000);
      if (differencevalue < 10) // less than 30 seconds ago will show as 'Just now'
        return 'Just now';
      const intervals = {
        'year': 31536000,
        'month': 2592000,
        'week': 604800,
        'day': 86400,
        'hour': 3600,
        'minute': 60,
        'second': 1
      };
      let counter;
      for (const i in intervals) {
        counter = Math.floor(differencevalue / intervals[i]);
        if (counter > 0)
          if (counter === 1) {
            return counter + ' ' + i + ' ago';
          } else {
            return counter + ' ' + i + 's ago';
          }
      }
    }
    return differencevalue;
  }

  posts_more(){
    this.post_page++;
    this.api.getCustomerPosts({ customer_id: this.customer_id, page: this.post_page }).subscribe((resp: any) => {
      this.customer_posts = this.customer_posts.concat(resp.data);

      if(resp.data.length<5)
        this.post_more  = false
    })
  }

  replies_more(){
    this.reply_page++;
    this.api.getCustomerReplies({ customer_id: this.customer_id, page: this.reply_page }).subscribe((resp: any) => {
      this.customer_replies = this.customer_replies.concat(resp.data);

      if(resp.data.length<5)
        this.reply_more  = false
    })
  }

  likes_more(){
    this.like_page++
    this.api.getCustomerLikes({ customer_id: this.customer_id, page: this.like_page }).subscribe((resp: any) => {
      this.customer_likes = this.customer_likes.concat(resp.data);
  
      if(resp.data.length<5)
        this.like_more  = false
    })
  }

  reviews_more(){
    this.review_page++
    this.api.getCustomerReviews({ customer_id: this.customer_id, page: this.review_page }).subscribe((resp: any) => {
      this.customer_reviews = this.customer_reviews.concat(resp.data);
      if(resp.data.length<5)
        this.review_more   = false
    })
  }
  
  addFriend(customer_id: any) {
    if(this.api.user.id == 0){
      this.alert.error('Please sign up to add Airparks')
    }
    else{
      const data = {
        customer_id: customer_id
      }
      this.api.friendRequest(data).subscribe((resp: any) => {
        if (resp.success === false) {
          this.alert.error(resp.errors.general)
         
        } else {
           this.send_request(resp.data);
           this.alert.success(resp.msg)
        }
      })
    }
  }
  

  openGallery(index, galleryType, images: any) {
    this.albums = []
    let show = false
    if (galleryType == 'review') {

        images.forEach(d => {
            const imageData = {
                src: this.api.reviewImageUrl(d.id),
                caption: '',
                thumb: this.api.reviewImageUrl(d.id)
            }
            this.albums.push(imageData)
        })
        show = true
    } else if (galleryType == 'reply') {

        images.forEach(d => {
            const imageData = {
                src: this.api.replyImageUrl(d.id),
                caption: '',
                thumb: this.api.replyImageUrl(d.id)
            }
            this.albums.push(imageData)
        })
        show = true
    } else if (galleryType == 'post') {

      images.forEach(d => {
          const imageData = {
              src: this.api.getPostImageUrl(d.image_name),
              caption: '',
              thumb: this.api.getPostThumbImageUrl(d.image_name)
          }
          this.albums.push(imageData)
      })
      show = true
    }
    
    if (show == true) {
        this.open(index)
    }
  }

  open(index: number): void {
      // open lightbox
      this.lightbox.open(this.albums, index, {
          alwaysShowNavOnTouchDevices: true,
          disableScrolling: true,
          albumLabel: '',
          wrapAround: true,
          showImageNumberLabel: true,
          centerVertically: true
      }
      )
  }

  playVideo (event: any, template: TemplateRef<any>, url:any) {
    
    this.modal_video_url = url;
    console.log(this.modal_video_url)
    this.videoModalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-md modal-dialog-centered website' })
    )
  }

  send_request(data: any) {
    this.socketService.socket.emit('send_request', data);
  }
  

  airports_more(){
    this.airport_page++
    this.api.getCustomerAirports({ customer_id: this.customer_id, page: this.airport_page }).subscribe((resp: any) => {
      if (resp != null) {
       
        this.customer_airports = this.customer_airports.concat(resp.data)
        if(resp.data.length<15)
          this.airport_more   = false
        else
          this.airport_more   = true
      } else {
        this.customer_airports = []
        this.airport_more   = false
      }
    })
  }

  toggleSubscribe(airportid: any, state:any, airportsindex:any): any {

    this.api.toggleSubscribe({ airport_id: airportid, state: state }).subscribe((resp: any) => {
 
       this.customer_airports[airportsindex].subscribed_state = state;
    })
  }
}
