import { Component, OnInit,TemplateRef, ViewChild, ElementRef } from '@angular/core'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { ApiService } from 'src/app/services/api.service'
import { SocketsService } from 'src/app/services/sockets.service'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { BsModalService } from 'ngx-bootstrap/modal'
import { ImageCroppedEvent } from 'ngx-image-cropper'

declare var $: any;

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.css']
})
export class MyPostsComponent implements OnInit {
  @ViewChild('canvasEl') canvasEl : ElementRef<HTMLCanvasElement>;
  @ViewChild('videoEl') videoEl: ElementRef<HTMLVideoElement>;
  @ViewChild('imageEl') imageEl: ElementRef<HTMLImageElement>;
  private _CANVAS:any = null;
  private _CONTEXT:any = null;


  airportSearchForm: FormGroup
  createPostForm: FormGroup
  createCommentForm: FormGroup
  createReplyForm: FormGroup
  reportForm: FormGroup

  cards = [];
  slides: any = [[]];
  throttle = 0;
  distance = 2;
  page = 1;
  card_list: any = [];
  count = 0;
  tableSize = 3;

  chunk(arr, chunkSize) {
    let R = [];
    for (let i = 0, len = arr.length; i < len; i += chunkSize) {
      R.push(arr.slice(i, i + chunkSize));
    }
    return R;
  }

 
  global_posts: any = []
  imageChangedEvent: any = ''
  croppedImage: any = ''
  cropperModalRef: BsModalRef
  reportModalRef: BsModalRef
  thumbnail:any
  image_file:any
  post_page:number =1
  post_more:boolean = true 

  report_post_id:any = 0
  report_type:any


  
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
    public api: ApiService,
    public socketService : SocketsService,
    private alert: IAlertService,
    public route: ActivatedRoute,
    private modalService: BsModalService,
  ) {

   
  }

  urls = [];
  myFiles: any = [];
  videourl = ''
  myVideoFile = null
  myVideoThumbFile = null

  postForm = new FormGroup({
    post_content: new FormControl('', [Validators.required, Validators.minLength(3)]),
    post_images: new FormControl([], []),
    post_video: new FormControl(null, []),
  });

  ngOnInit(): void {
    this.initializeAirportSearchForm()
    this.initializeCreateCommentForm()
    this.initializeCreateReplyForm()
    this.initializeReportForm()


    this.api.getPosts({ page: this.post_page}).subscribe((resp: any) => {
      if (resp != null) {
        this.global_posts = this.global_posts.concat(resp.data)
        if(resp.data.length<5)
          this.post_more   = false
        else
          this.post_more   = true
      } else {
        this.global_posts = []
        this.post_more   = false
      }
    })

    this.api.getAirportsCard({ search_content: '' }).subscribe((resp: any) => {
      if (resp != null) {
        this.cards = resp.data
      } else {
        this.cards = []
      }
    })
  }

  initializeAirportSearchForm() {
    this.airportSearchForm = this.fb.group({
      search_content: new FormControl(null, [Validators.minLength(5)]),
    })
  }
  
  initializeCreateCommentForm() {
    this.createCommentForm = this.fb.group({
      comment_content: new FormControl(null, [Validators.required,Validators.maxLength(2000)]),
    })
  }

  initializeCreateReplyForm() {
    this.createReplyForm = this.fb.group({
      reply_content: new FormControl(null, [Validators.required,Validators.maxLength(2000)]),
    })
  }

  initializeReportForm(){
    this.reportForm = this.fb.group({
      report_content: new FormControl(null, [Validators.required,Validators.maxLength(2000)]),
    })
  }

  toggleSubscribe(airportid: any): any {
    let state = 0;
    for (let i = 0; i < this.cards.length; i++) {
      if (this.cards[i].airport_id == airportid) {
        state = 1 - this.cards[i].subscribed_state;
        this.cards[i].subscribed_state = state;
      }
    }
    this.api.toggleSubscribe({ airport_id: airportid, state: state }).subscribe((resp: any) => {
      this.api.getPosts({ page: 1 }).subscribe((resp: any) => {
        this.global_posts = resp.data;
      })
      this.api.getSubscribedAirport().subscribe((resp: any) => {
        if (resp != null) {
          this.api.myAirportList = resp.data

        }
      })
    })
  }

  onTableDataChange(event) {
    this.page = event;
  }

  searchAirport(data: any) {
    let formData = new FormData();
    this.page = 1;
    formData = this.api.jsonToFormData(data.value);
    this.api.getAirportsCard(formData).subscribe((resp: any) => {
      if (resp.success === false) {
        this.alert.error(resp.errors.general)
        return false
      } else {
        this.cards = resp.data;
      }
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
    formData.append('post_video', this.myVideoFile)
    formData.append('post_video_thumb', this.myVideoThumbFile)

    this.api.createPost(formData).subscribe((resp: any) => {
      if (resp.success === false) {
        this.alert.error(resp.errors.general)
      } else {
        this.global_posts.unshift(resp.data)
        this.alert.success('New Post created successfully')

        this.sendPost({'post_type':'1', 'airport_id':this.api.homeairport['airport_id'], 'airport_name':this.api.homeairport['airport_name'],'first_name':resp.data.user.first_name, 'last_name':resp.data.user.last_name,'user_id':resp.data.user_id})
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
        this.global_posts[index].comment.push(resp.data);
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
        this.global_posts[postindex].comment[cmtindex].reply.push(resp.data);
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
    const datas = this.global_posts[id].assessment;
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
    const datas = this.global_posts[postindex].comment[commentindex].assessment;
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
    const datas = this.global_posts[postindex].comment[commentindex].reply[replyindex].assessment;
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
        this.global_posts[index].assessment.push(resp.data)
   
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
        this.global_posts[postindex].comment[cmtindex].assessment.push(resp.data)

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
        this.global_posts[postindex].comment[cmtindex].reply[replyindex].assessment.push(resp.data)
       
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
    this.api.getPosts({page: this.post_page }).subscribe((resp: any) => {
      
      if (resp != null) {
        this.global_posts = this.global_posts.concat(resp.data)
        if(resp.data.length<5)
          this.post_more   = false
        else
          this.post_more   = true
      } else {
        this.global_posts = []
        this.post_more   = false
      }
  
    })
  }

  signup_alert() {
    this.alert.error('Please sign up')
  }
  
  report_modal(post_id: any, report_type: any, template: TemplateRef<any>){
    this.report_post_id = post_id
    this.report_type = report_type
        
    this.reportModalRef = this.modalService.show(
        template,
        Object.assign({}, { class: 'modal-md modal-dialog-centered website' })
    )
  }


  send_report(data: any) {
    if(this.api.user.id ==0){
      this.alert.error('Please signup to post')
      return
    }
    if (data.status === 'INVALID') {
      this.alert.error('Please fill out valid data in all fields and try again')
      return
    }
    
    const formData = this.api.jsonToFormData(data.value)


    formData.append("report_post_id", this.report_post_id)
    formData.append('report_type', this.report_type)
 
    this.api.sendReport(formData).subscribe((resp: any) => {

      if (resp.success === false) {
        this.alert.error(resp.errors.general)
      } else {
        this.alert.success("Reported successfully")
      }

      this.reportModalRef.hide()

    })
  }
}

