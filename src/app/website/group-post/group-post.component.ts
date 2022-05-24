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
  selector: 'app-group-post',
  templateUrl: './group-post.component.html',
  styleUrls: ['./group-post.component.css']
})
export class GroupPostComponent implements OnInit  {
  @ViewChild('canvasEl') canvasEl : ElementRef<HTMLCanvasElement>;
  @ViewChild('videoEl') videoEl: ElementRef<HTMLVideoElement>;
  @ViewChild('imageEl') imageEl: ElementRef<HTMLImageElement>;
  private _CANVAS:any = null;
  private _CONTEXT:any = null;

  createPostForm: FormGroup
  createCommentForm: FormGroup
  createReplyForm: FormGroup

  groupInfo: any
  group_name: any
  group_description: any
  group_creator: any
  group_member_cnt: any
  group_created_at: any
  group_updated_at: any
  groupId: string
  
  group_posts: any = []
  post_page:number =1
  post_more:boolean = true 

  imageChangedEvent: any = ''
  croppedImage: any = ''
  cropperModalRef: BsModalRef
  thumbnail:any
  image_file:any

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

  constructor(
    private fb: FormBuilder,
    public api: ApiService,
    public socketService : SocketsService,
    private alert: IAlertService,
    public route: ActivatedRoute,
    private modalService: BsModalService,
  ) {
    
    this.initializeCreateCommentForm()
    this.initializeCreateReplyForm()
  
  }

  ngOnInit(): void {
    
    this.groupId = this.route.snapshot.paramMap.get('group_id')
    const params = {
      group_id: this.groupId
    }
    this.api.getGroupInfo(params).subscribe((resp: any) => {
      this.groupInfo = resp.data
      this.group_name = resp.data.group_name
      this.group_description = resp.data.group_description
      this.group_creator = resp.data.user.first_name + ' ' + resp.data.user.last_name
      this.group_member_cnt = resp.data.group_member_cnt
      this.group_created_at = resp.data.created_at
      this.group_updated_at = resp.data.updated_at
      
    })

    this.api.getGroupPost({ group_id: this.groupId, page: this.post_page}).subscribe((resp: any) => {
      if (resp != null) {
        this.group_posts = resp.data
        if(resp.data.length<5)
          this.post_more  = false
        
      } else {
        this.group_posts = []
        this.post_more  = false

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

    formData.append("post_type", '2');
    formData.append("group_id", this.groupId);
    for (var i = 0; i < this.myFiles.length; i++) {
      formData.append("post_images[]", this.myFiles[i]);
    }
    this._CANVAS = this.canvasEl.nativeElement;
    this._CONTEXT = this._CANVAS.getContext('2d').drawImage(this.videoEl.nativeElement, 0, 0, 300, 150);
    this.myVideoThumbFile = this.dataURItoBlob(this._CANVAS.toDataURL());
    formData.append('post_video', this.myVideoFile)
    formData.append('post_video_thumb', this.myVideoThumbFile)
    
    this.api.createPost_Group(formData).subscribe((resp: any) => {
      if (resp.success === false) {
        this.alert.error(resp.errors.general)
      } else {
        this.group_posts.unshift(resp.data)
        this.alert.success('New Post created successfully')

        this.sendPost({'group_id':this.groupId, 'group_name':this.group_name, 'first_name':resp.data.user.first_name, 'last_name':resp.data.user.last_name,'user_id':resp.data.user_id})

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

  createComment(index: any, data: any, post_id: any, post_user_id:any): void {
    if(this.api.user.id ==0){
      this.alert.error('Please signup ')
      return
    }

    if (data.status === 'INVALID') {
      this.alert.error('Please fill out valid data in all fields a nd try again')
      return
    }
    
    const formData = this.api.jsonToFormData(data.value)
    formData.append('post_id', post_id);
    this.api.createComment(formData).subscribe((resp: any) => {
      if (resp.success === false) {
        this.alert.error(resp.errors.general)
      } else {
        if (resp.success === false) {
          this.alert.error(resp.errors.general)
          return
        } else {
          this.group_posts[index].comment.push(resp.data);
          this.sendComment({'group_id':this.groupId, 'group_name':this.group_name, 'first_name':resp.data.user.first_name, 'last_name':resp.data.user.last_name,'sender_id':resp.data.user_id,'receiver_id':post_user_id});
          this.alert.success('New Comment is created successfully')
          this.initializeCreateCommentForm()
        }
      }
    })
  }

  createReply(postindex: any, cmtindex: any, data: any,  cmt_id: any, comment_user_id:any): void {
    if(this.api.user.id ==0){
      this.alert.error('Please signup')
      return
    }

    if (data.status === 'INVALID') {
      this.alert.error('Please fill out valid data in all fields a nd try again')
      return
    }

    const formData = this.api.jsonToFormData(data.value)
     formData.append('comment_id', cmt_id)
    this.api.createReply(formData).subscribe((resp: any) => {
      if (resp.success === false) {
        this.alert.error(resp.errors.general)
        return
      } else {
        const data = { ...resp.data, duration: 1 };
        this.group_posts[postindex].comment[cmtindex].reply.push(data);
        this.toggleShowReplyAdd(cmt_id)
        this.alert.success('New Reply created successfully')
        this.sendReply({'group_id':this.groupId, 'group_name':this.group_name, 'first_name':resp.data.user.first_name, 'last_name':resp.data.user.last_name,'user_id':resp.data.user_id,'receiver_id':comment_user_id})
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

  getGroupImageUrl(data: any): string {
    return this.api.baseUrl + '/group-image/' + data
  }

  getSliderObject(cnt: any, postid: any): any {
    let imageObject = [];
    for (let i = 1; i < parseInt(cnt) + 1; i++) {
      const temp = this.api.baseUrl + '/post-image/' + postid + '_' + i;
      imageObject.push(temp);
    }
    return imageObject;
  }

  getVideoUrl(postid: any): any {
    return this.api.baseUrl + '/post-video/' + postid;
  }

  getKudoRank(id: any): any {
    let kudodata = [];
    const datas = this.group_posts[id].assessment;
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
    const datas = this.group_posts[postindex].comment[commentindex].assessment;
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
    const datas = this.group_posts[postindex].comment[commentindex].reply[replyindex].assessment;
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
      group_id: this.groupId,
      post_user_id:post_user_id
    }
    this.api.postLike(data).subscribe((resp: any) => {
      if (resp.success === false) {
        this.alert.error(resp.errors.general)
        return
      } else {
        const temp = resp.data;
        this.group_posts[index].assessment.push(temp)
       // this.sendPostLike({ data: temp, index: index, group_id: this.groupId });
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
      group_id: this.groupId,
      comment_user_id:comment_user_id,
    }
    this.api.commentLike(data).subscribe((resp: any) => {
      if (resp.success === false) {
        this.alert.error(resp.errors.general)
        return 
      } else {
        const temp = resp.data
        this.group_posts[postindex].comment[cmtindex].assessment.push(temp)
        //this.sendCommentLike({ data: data, group_id: this.groupId, postindex: postindex, commentindex: cmtindex })
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
      group_id: this.groupId,
      reply_user_id:reply_user_id
    }
    this.api.replyLike(data).subscribe((resp: any) => {
      if (resp.success === false) {
        this.alert.error(resp.errors.general)
        return 
      } else {
        const temp = resp.data
        this.group_posts[postindex].comment[cmtindex].reply[replyindex].assessment.push(resp.data)
        //this.sendReplyLike({ data: data, group_id: this.groupId, postindex: postindex, commentindex: cmtindex, replyindex: replyindex })
      }
    })
  }

  imageFileSelect() {
    $("#image_file").trigger("click");
  }

  videoFileSelect() {
    $("#video_file").trigger("click");
  }

  posts_more(){

    this.post_page ++;
    this.api.getGroupPost({group_id: this.groupId, page: this.post_page }).subscribe((resp: any) => {
      if (resp != null) {

      this.group_posts = this.group_posts.concat(resp.data)
      if(resp.data.length<5)
          this.post_more   = false
        else
          this.post_more   = true
      } else {
        this.group_posts = []
        this.post_more   = false
      }

    })
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

  // socketListen(){
  //   this.socketService.socket.on('new_post', (data) => {
  //     if (this.groupId == data.group_id) {
  //       this.group_posts.unshift(data);
        
  //       this.alert.success(data.user.first_name+' '+ data.user.last_name +' posted.')
  //     }
  //   })

  //   this.socketService.socket.on('new_comment', (data) => {
  //     if (this.groupId == data.group_id) {
  //       this.group_posts[data.index].comment.push(data);
  //       this.alert.success(data.user.first_name+' '+ data.user.last_name +' commented.')
  //     }
  //   })

  //   this.socketService.socket.on('new_reply', (data) => {
  //     if (this.groupId == data.group_id) {
  //       this.group_posts[data.postindex].comment[data.commentindex].reply.push(data);
  //       this.alert.success(data.user.first_name+' '+ data.user.last_name +' replied.')
  //     }
  //   })

  //   this.socketService.socket.on('new_post_like', (data) => {
  //     if (this.groupId == data.group_id) {
  //       this.group_posts[data.index].assessment.push(data.data);
  //       // this.api.newNotification++
  //     }
  //   })

  //   this.socketService.socket.on('new_comment_like', (data) => {
  //     if (this.groupId == data.group_id) {
  //       this.group_posts[data.postindex].comment[data.commentindex].assessment.push(data.data);
  //       // this.api.newNotification++
  //     }
  //   })
    
  //   this.socketService.socket.on('new_reply_like', (data) => {
  //     if (this.groupId == data.group_id) {
  //       this.group_posts[data.postindex].comment[data.commentindex].reply[data.replyindex].assessment.push(data.data);
  //       // this.api.newNotification++
  //     }
  //   })
  // }

  sendPost(postdata: any) {

    this.socketService.socket.emit('send_post', postdata)
  }

  sendComment(commentdata: any) {
    this.socketService.socket.emit('send_comment', commentdata);
  }

  sendReply(replydata: any) {
    this.socketService.socket.emit('send_reply', replydata);
  }

  // sendPostLike(postlikedata: any) {
  //   this.socketService.socket.emit('send_post_like', postlikedata);
  // }

  // sendCommentLike(commentlikedata: any) {
  //   this.socketService.socket.emit('send_comment_like', commentlikedata);
  // }

  // sendReplyLike(replylikedata: any) {
  //   this.socketService.socket.emit('send_reply_like', replylikedata);
  // }
}
