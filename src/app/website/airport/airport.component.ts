import { Component, OnInit,TemplateRef, ViewChild, ElementRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { SocketsService } from 'src/app/services/sockets.service'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { BsModalService } from 'ngx-bootstrap/modal'
import { ImageCroppedEvent } from 'ngx-image-cropper'

declare var $: any;
@Component({
  selector: 'app-airport',
  templateUrl: './airport.component.html',
  styleUrls: ['./airport.component.scss']
})
export class AirportComponent implements OnInit {
  @ViewChild('canvasEl') canvasEl : ElementRef<HTMLCanvasElement>;
  @ViewChild('videoEl') videoEl: ElementRef<HTMLVideoElement>;
  @ViewChild('imageEl') imageEl: ElementRef<HTMLImageElement>;
  private _CANVAS:any = null;
  private _CONTEXT:any = null;

  airparksForm: FormGroup
  groups = []

  airport_id: any
  airportInfo: any
  airport_name: any
  airport_latitude: any
  airport_longitude: any
  airport_subscribed_state: any

  buttonState = 1;

  createPostForm: FormGroup
  createCommentForm: FormGroup
  createReplyForm: FormGroup
  
  airport_posts: any = []
  aviRators: any = []

  post_page:number =1
  group_page:number =1
  aviRator_page:number =1

  post_more:boolean = true 
  group_more:boolean = true 
  aviRator_more:boolean = true 

  imageChangedEvent: any = ''
  croppedImage: any = ''
  cropperModalRef: BsModalRef
  thumbnail:any
  image_file:any

  urls = [];
  myFiles: any = [];
  videourl = ''
  myVideoFile = null
  myVideoThumbFile = null

  postForm = new FormGroup({
    post_content: new FormControl('', [Validators.required, Validators.minLength(5)]),
    post_images: new FormControl([], []),
    post_video: new FormControl(null, []),
  });

  kudoList: any = [
    {
      content: 'Like',
      source: '/assets/images/mood-Like.svg'
    },
    {
      content: 'Thank',
      source: '/assets/images/mood-Thank.svg'
    },
    {
      content: 'Agree',
      source: '/assets/images/mood-Agree.svg'
    },
    {
      content: 'Haha',
      source: '/assets/images/mood-Haha.svg'
    },
    {
      content: 'Wow',
      source: '/assets/images/mood-Wow.svg'
    },
    {
      content: 'Sad',
      source: '/assets/images/mood-Sad.svg'
    }
  ]

  constructor(
    private fb: FormBuilder,
    public route: ActivatedRoute,
    public socketService: SocketsService,
    public router: Router,
    public api: ApiService,
    private modalService: BsModalService,
    public alert: IAlertService
  ) {
    this.initializeAirparksForm();
    this.initializeCreateCommentForm()
    this.initializeCreateReplyForm()

    this.airport_id = this.route.snapshot.paramMap.get('airport_id');

    this.api.getAirportInfo({ airport_id: this.airport_id }).subscribe((resp: any) => {
      this.airportInfo = resp.data;
      this.airport_subscribed_state = this.airportInfo[0].subscribed_state
      this.airport_name = this.airportInfo[0].airport_name
      this.airport_latitude = this.airportInfo[0].latitude_deg > 0 ? this.airportInfo[0].latitude_deg + ' North Latitue' : Math.abs(this.airportInfo[0].latitude_deg) + ' South Latitude'
      this.airport_longitude = this.airportInfo[0].longitude_deg > 0 ? this.airportInfo[0].longitude_deg + ' East Longitude' : Math.abs(this.airportInfo[0].longitude_deg) + ' West Longitude'
    })

    
    
  }

  ngOnInit(): void {

    this.api.getAirportPosts({ airport_id: this.airport_id, page: this.post_page}).subscribe((resp: any) => {
      if (resp != null) {
        this.airport_posts = resp.data
        if(resp.data.length<5)
          this.post_more   = false
        
      } else {
        this.airport_posts = []
        this.post_more   = false
      }
   
    })
    
    this.api.getAirportGroups({ airport_id: this.airport_id, page: this.post_page, search_content: "" }).subscribe((resp: any) => {
      if (resp != null) {
        this.groups = resp.data
        if(resp.data.length<5)
          this.group_more  = false
        
      } else {
        this.groups = []
        this.group_more  = false
 
      }

    })

    this.api.getAirportAviRators({ airport_id: this.airport_id, page: this.post_page }).subscribe((resp: any) => {

      if (resp != null) {
        this.aviRators = resp.data
        if(resp.data.length<50)
          this.aviRator_more  = false
        
      } else {
        this.aviRators = []
        this.aviRator_more  = false

      }
    })

  }

  sendRequest(request) {
    this.socketService.socket.emit('send_request', request);
  }

  join(groupid: any) {
    const data = {
      group_id: groupid
    }
    this.api.join(data).subscribe((resp: any) => {
      if (resp.success === false) {
        this.alert.error(resp.errors.general)
        return false
      } else {
        this.router.navigate(['/group-post/' + groupid])
        this.api.getMyGroupList({ my_search_content: '', page: 0 }).subscribe((resp: any) => {
          if (resp != null) {
            this.api.myGroupList = resp.data
          }
          
        })
        this.alert.success('joined')
      }
    })
  }

  JoinRequest(groupid: any, index: any) {
    const data = {
      group_id: groupid
    }
    this.api.JoinRequest(data).subscribe((resp: any) => {
      if (resp.success === false) {
        this.alert.error(resp.errors.general)
        return false
      } else {
        // this.airparks[index].state = 'in progress'
        this.sendRequest(resp.data)
        this.alert.success("Your request has been sent successfully.")
      }
    })
  }


  initializeAirparksForm() {
    this.airparksForm = this.fb.group({
      search_content: new FormControl(null, [Validators.minLength(5)]),
    })
  }


  submit(data: any) {
   
    let formData = this.api.jsonToFormData(data.value)
    formData.append("airport_id", this.airport_id)
    this.api.getAirportGroups(formData).subscribe((resp: any) => {
      this.groups = resp.data
    })
  }

  initializeCreateCommentForm() {
    this.createCommentForm = this.fb.group({
      comment_content: new FormControl(null, [Validators.required]),
    })
  }

  initializeCreateReplyForm() {
    this.createReplyForm = this.fb.group({
      reply_content: new FormControl(null, [Validators.required]),
    })
  }

  removeImage(i) {
    this.myFiles.splice(i, 1);
    this.urls.splice(i, 1);
  }

  removeVideo() {
    this.myVideoFile = null;
    this.myVideoThumbFile = null
    this.videourl = '';
    $(".video_preview").addClass('d-none');
  }

  onVideoChange(event) {
    for (let i = 0; i < event.target.files.length; i++) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.videourl = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      
     
      this.myVideoFile = event.target.files[0];
      const allowedExtensions = ['mp4']
      const extension = this.myVideoFile.name.split('.').pop().toLowerCase()
      if (allowedExtensions.indexOf(extension) < 0) {
        this.alert.error('Invalid file type. Only Mp4 are allowed')
        this.removeVideo()
      }
     
      if(this.myVideoFile !=null){
        $(".video_preview").removeClass('d-none');
      }
    }
  }

  dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
      const blobBin = atob(dataURI.split(',')[1]);
      const array = [];
      for(var i = 0; i < blobBin.length; i++) {
          array.push(blobBin.charCodeAt(i));
      }
      const file=new Blob([new Uint8Array(array)], {type: 'image/png'});

      return file;
  }

  createPost(data: any) {
    if(this.api.user.id ==0){
      this.alert.error('Please signup to post')
      return
    }
    if (data.status === 'INVALID') {
      this.alert.error('Please fill out valid data in all fields and try again')
      return
    }
    
    const formData = this.api.jsonToFormData(data.value)

    for (var i = 0; i < this.myFiles.length; i++) {
      formData.append("post_images[]", this.myFiles[i]);
    }

    this._CANVAS = this.canvasEl.nativeElement;
    this._CONTEXT = this._CANVAS.getContext('2d').drawImage(this.videoEl.nativeElement, 0, 0, 300, 150);
    this.myVideoThumbFile = this.dataURItoBlob(this._CANVAS.toDataURL());

    formData.append("post_type", '1')
    formData.append("airport_id", this.airport_id)
    formData.append('post_video', this.myVideoFile)
    formData.append('post_video_thumb', this.myVideoThumbFile)

    this.api.createPost(formData).subscribe((resp: any) => {
      if (resp.success === false) {
        this.alert.error(resp.errors.general)
      } else {
        this.airport_posts.unshift(resp.data)
        this.alert.success('New Post created successfully')

        this.sendPost({'post_type':'1', 'airport_id':this.airport_id, 'airport_name':this.airport_name,'first_name':resp.data.user.first_name, 'last_name':resp.data.user.last_name,'user_id':resp.data.user_id})
        this.postForm = new FormGroup({
          post_content: new FormControl('', [Validators.required, Validators.minLength(3)]),
          post_images: new FormControl([], []),
          post_video: new FormControl(null, []),
        });
        this.myFiles = []
        this.urls = []
        this.removeVideo()
      }
    })
  }
 
  createComment(index: any, data: any, group: any , post_id: any, post_user_id:any): boolean {

    let group_id = "";
    let group_name = "";

    if(group != null){
      group_id = group.id;
      group_name = group.group_name;
    }else{
      group_id = '0';
      group_name = 'Global Post';
    }

    if(this.api.user.id ==0){
      this.alert.error('Please signup')
      return
    }

    if (data.status === 'INVALID') {
      this.alert.error('Please fill out valid data in all fields a nd try again')
      return
    }

    const formData = this.api.jsonToFormData(data.value)
    formData.append('post_id', post_id)
    formData.append('post_user_id', post_user_id);
    this.api.createComment(formData).subscribe((resp: any) => {
      if (resp.success === false) {
        this.alert.error(resp.errors.general)
        return false
      } else {
        this.airport_posts[index].comment.push(resp.data);
        this.alert.success('New Comment created successfully')
        this.sendComment({'post_type':'1', 'airport_id':this.api.homeairport['airport_id'], 'airport_name':this.api.homeairport['airport_name'], 'first_name':resp.data.user.first_name, 'last_name':resp.data.user.last_name,'user_id':resp.data.user_id,'receiver_id':post_user_id});
        this.initializeCreateCommentForm()
      }
    })
  }

  createReply(postindex: any, cmtindex: any, data: any, group: any, post_id: any, cmt_id: any, comment_user_id:any): boolean {
    let group_id = "";
    let group_name = "";

    if(group != null){
      group_id = group.id;
      group_name = group.group_name;
    }else{
      group_id = '0';
      group_name = 'Global Post';
    }

    if(this.api.user.id ==0){
      this.alert.error('Please signup')
      return
    }

    if (data.status === 'INVALID') {
      this.alert.error('Please fill out valid data in all fields a nd try again')
      return false
    }

    const formData = this.api.jsonToFormData(data.value)
    formData.append('post_id', post_id)
    formData.append('comment_id', cmt_id)
    formData.append('comment_user_id', comment_user_id)
    this.api.createReply(formData).subscribe((resp: any) => {
      if (resp.success === false) {
        this.alert.error(resp.errors.general)
        return false
      } else {
        this.airport_posts[postindex].comment[cmtindex].reply.push(resp.data);
        this.alert.success('New Reply created successfully')
        this.sendComment({'post_type':'1', 'airport_id':this.api.homeairport['airport_id'], 'airport_name':this.api.homeairport['airport_name'], 'first_name':resp.data.user.first_name, 'last_name':resp.data.user.last_name,'user_id':resp.data.user_id,'receiver_id':comment_user_id});
        this.initializeCreateReplyForm()
      }
    })
  }

  toggleShowReplyAdd(commentid: any): any {
    if ($('.create-reply-form' + commentid).hasClass('d-none')) {
      $('.create-reply-form' + commentid).removeClass('d-none')
      $('.create-reply-form' + commentid).fadeIn(3000);
    }
    else {
      $('.create-reply-form' + commentid).addClass('d-none')
      $('.create-reply-form' + commentid).fadeOut(3000);
    }
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

  getSliderObject(cnt: any, postid: any): any {
    let imageObject = [];
    for (let i = 1; i < parseInt(cnt) + 1; i++) {
      const temp = this.api.baseUrl + '/post-image/' + postid + '_' + i;
      imageObject.push(temp);
    }
    return imageObject;
  }

  getKudoRank(id: any): any {
    let kudodata = [];
    const datas = this.airport_posts[id].assessment;
    for (let i = 0; i < this.kudoList.length; i++) {
      const temp = {
        content: this.kudoList[i].content,
        cnt: datas.filter(data => data.assessment_type == this.kudoList[i].content).length
      }
      kudodata.push(temp);
    }
    kudodata.sort(function (a, b) { return b.cnt - a.cnt }).splice(3, 3);
    kudodata = kudodata.filter(data => data.cnt > 0).map(data => "/assets/images/mood-" + data.content + ".svg");
    return kudodata;
  }

  getCmtKudoRank(postindex: any, commentindex: any): any {
    let kudodata = [];
    const datas = this.airport_posts[postindex].comment[commentindex].assessment;
    for (let i = 0; i < this.kudoList.length; i++) {
      const temp = {
        content: this.kudoList[i].content,
        cnt: datas.filter(data => data.assessment_type == this.kudoList[i].content).length
      }
      kudodata.push(temp);
    }
    kudodata.sort(function (a, b) { return b.cnt - a.cnt }).splice(3, 3);
    kudodata = kudodata.filter(data => data.cnt > 0).map(data => "/assets/images/mood-" + data.content + ".svg");
    return kudodata;
  }

  getReplyKudoRank(postindex: any, commentindex: any, replyindex: any): any {
    let kudodata = [];
    const datas = this.airport_posts[postindex].comment[commentindex].reply[replyindex].assessment;
    for (let i = 0; i < this.kudoList.length; i++) {
      const temp = {
        content: this.kudoList[i].content,
        cnt: datas.filter(data => data.assessment_type == this.kudoList[i].content).length
      }
      kudodata.push(temp);
    }
    kudodata.sort(function (a, b) { return b.cnt - a.cnt }).splice(3, 3);
    kudodata = kudodata.filter(data => data.cnt > 0).map(data => "/assets/images/mood-" + data.content + ".svg");
    return kudodata;
  }

  postLike(index: any, postid: any, post_user_id:any, kudo: any): void {
    if(this.api.user.id ==0){
      this.alert.error('Please signup')
      return
    }

    const data = {
      post_id: postid,
      assessment_type: kudo,
      post_user_id:post_user_id
    }
    this.api.postLike(data).subscribe((resp: any) => {
      if (resp.success === false) {
        this.alert.error(resp.errors.general)
        return
      } else {
        const temp = resp.data;
        this.airport_posts[index].assessment.push(resp.data)
   
      }
    })
  }

  commentLike(postindex: any, cmtindex: any, commentid: any, comment_user_id: any, kudo: any): void {
    if(this.api.user.id ==0){
      this.alert.error('Please signup')
      return
    }

    const data = {
      comment_id: commentid,
      assessment_type: kudo,
      comment_user_id:comment_user_id
    }
    this.api.commentLike(data).subscribe((resp: any) => {
      if (resp.success === false) {
        this.alert.error(resp.errors.general)
        return
      } else {
        const temp = resp.data
        this.airport_posts[postindex].comment[cmtindex].assessment.push(resp.data)

      }
    })
  }

  replyLike(postindex: any, cmtindex: any, replyindex: any, replyid: any, reply_user_id: any, kudo: any): void {
    if(this.api.user.id ==0){
      this.alert.error('Please signup')
      return
    }

    const data = {
      reply_id: replyid,
      assessment_type: kudo,
      reply_user_id:reply_user_id
    }
    this.api.replyLike(data).subscribe((resp: any) => {
      if (resp.success === false) {
        this.alert.error(resp.errors.general)
        return
      } else {
        const temp = resp.data
        this.airport_posts[postindex].comment[cmtindex].reply[replyindex].assessment.push(resp.data)
       
      }
    })
  }

  imageFileSelect() {
    $("#image_file").trigger("click");
  }

  videoFileSelect() {
    $("#video_file").trigger("click");
  }

  doneCroppingThumbnail() {
    this.thumbnail = this.croppedImage
    this.myFiles.push(this.dataURItoBlob( this.thumbnail) );
    this.urls.push(this.thumbnail);
    this.cropperModalRef.hide()
  }

  browseThumbnail(event: any) {
    event.preventDefault()
    const element = document.getElementById('thumbnail-image')
    element.click()
  }

  onThumbnailChange(event: any, template: TemplateRef<any>) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.image_file  = event.target.files[i]
    }
      
    const allowedExtensions = ['png', 'jpg', 'jpeg']
    const extension = this.image_file.name.split('.').pop().toLowerCase()
    const fileSize = this.image_file.size / 1024 / 1024
    if (fileSize > 3) {
        this.alert.error('Invalid file size. File size must not exceeds 3MB')
    } else if (allowedExtensions.indexOf(extension) < 0) {
        this.alert.error('Invalid file type. Only png, jpg or jpeg are allowed')
    } else {
        this.imageChangedEvent = event
        this.cropperModalRef = this.modalService.show(
            template,
            Object.assign({}, { class: 'modal-md modal-dialog-centered website' })
        )
    }
    
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64
  }

  imageLoaded() {
    // show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show message
  }

  sendPost(postdata: any) {

    this.socketService.socket.emit('send_global_post', postdata)
  }

  sendComment(commentdata: any) {

    this.socketService.socket.emit('send_comment', commentdata);
  }

  sendReply(replydata: any) {
    this.socketService.socket.emit('send_reply', replydata);
  }

  posts_more(){
    this.post_page++;
    this.api.getAirportPosts({ airport_id: this.airport_id, page: this.post_page}).subscribe((resp: any) => {
      if (resp != null) {
        this.airport_posts =  this.airport_posts.concat(resp.data)
        if(resp.data.length<5)
          this.post_more  = false
        
      } else {
        this.aviRators = []
        this.post_more  = false

      }
  
    })
  }


  toggleSubscribe(airportid: any, state :any): any {
    
    this.api.toggleSubscribe({ airport_id: airportid, state: state }).subscribe((resp: any) => {
      if (resp.success === false) {
        this.alert.error(resp.errors.general)
        return
      } else {
        this.airport_subscribed_state = state;
        this.api.getAirportPosts({ airport_id: this.airport_id, page: 1}).subscribe((resp: any) => {
          
          if (resp != null) {
            this.airport_posts = resp.data
            if(resp.data.length<5)
              this.post_more   = false
            
          } else {
            this.airport_posts = []
            this.post_more   = false
          }
        })
    
        this.api.getAirportGroups({ airport_id: this.airport_id, page: 1, search_content: "" }).subscribe((resp: any) => {
          if (resp != null) {
            this.groups = resp.data
            if(resp.data.length<5)
              this.group_more  = false
            
          } else {
            this.groups = []
            this.group_more  = false
     
          }
        })

        this.api.getAirportAviRators({ airport_id: this.airport_id, page: 1 }).subscribe((resp: any) => {
          if (resp != null) {
            this.aviRators = resp.data
            if(resp.data.length<50)
              this.aviRator_more  = false
            
          } else {
            this.aviRators = []
            this.aviRator_more  = false
    
          }
        })
        
        this.api.getSubscribedAirport().subscribe((resp: any) => {
          if (resp != null) {
            this.api.myAirportList = resp.data
  
          }
        })
      }
    })
  }

  groups_more(){
    this.group_page++
    this.api.getAirportGroups({  airport_id: this.airport_id,  page: this.group_page, search_content: "" }).subscribe((resp: any) => {
      if (resp != null) {
        this.groups = this.groups.concat(resp.data);
        if(resp.data.length<5)
          this.group_more   = false

      } else {
        this.groups = [];
        this.group_more   = false
      }
    })
  }

  aviRators_more(){
    this.aviRator_page++
    this.api.getAirportAviRators({  airport_id: this.airport_id,  page: this.aviRator_page }).subscribe((resp: any) => {
      if (resp != null) {
        this.aviRators = this.aviRators.concat(resp.data);
        if(resp.data.length<50)
          this.aviRator_more   = false

      } else {
        this.aviRators = [];
        this.aviRator_more   = false
      }
    })
  }

  

}
