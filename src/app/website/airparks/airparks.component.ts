import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { ApiService } from 'src/app/services/api.service'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { SocketsService } from 'src/app/services/sockets.service'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'

declare var $: any;

@Component({
  selector: 'app-airparks',
  templateUrl: './airparks.component.html',
  styleUrls: ['./airparks.component.scss']
})
export class AirparksComponent implements OnInit {

  myGroupList: any = []
  nearGroupList: any = []
  buttonState = 2;

  airportSearchForm: FormGroup
  mySearchForm: FormGroup
  nearSearchForm: FormGroup

  my_search_content = ''
  near_search_content = ''

  cards = [];
  
  slides: any = [[]];
  throttle = 0;
  distance = 2;
  page = 1;
  count = 0;
  tableSize = 3;

  airpark_page:number = 1;
  group_more:boolean = true;

  near_airpark_page:number = 1;
  near_airpark_more:boolean = true;

  chunk(arr, chunkSize) {
    let R = [];
    for (let i = 0, len = arr.length; i < len; i += chunkSize) {
      R.push(arr.slice(i, i + chunkSize));
    }
    return R;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public socketService: SocketsService,
    public api: ApiService,
    private alert: IAlertService,
  ) {
   
  }

  ngOnInit() {
    this.initializeAirportSearchForm();
    this.initializeMySearchForm();
    this.initializeNearSearchForm();

    this.api.getMyGroupList({ my_search_content: '', page: this.airpark_page }).subscribe((resp: any) => {
      if (resp != null) {
        this.myGroupList = resp.data
        if(resp.data.length<5)
          this.group_more   = false
        else
          this.group_more   = true
      } else {
        this.myGroupList = []
        this.group_more   = false
      }
    })

    this.api.getNearGroupList({ near_search_content: '', page: this.near_airpark_page }).subscribe((resp: any) => {
      if (resp != null) {
        this.nearGroupList = resp.data
        if(resp.data.length<5)
          this.near_airpark_more   = false
        
      } else {
        this.nearGroupList = []
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
      search_content: new FormControl(null, [Validators.minLength(3)]),
    })
  }

  initializeMySearchForm() {
    this.mySearchForm = this.fb.group({
      my_search_content: new FormControl(null, []),
    })
  }

  initializeNearSearchForm() {
    this.nearSearchForm = this.fb.group({
      near_search_content: new FormControl(null, []),
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
      this.near_airpark_page = 1
      this.api.getNearGroupList({ near_search_content: '', page: 1}).subscribe((resp: any) => {
        this.nearGroupList = resp.data
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

  submit(data: any, type: any) {
    let formData = new FormData();
    switch (type) {
      case 0:
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
        break;
      case 1:
        formData = this.api.jsonToFormData(data.value)
   
        formData.append('page', '1')
        this.api.getNearGroupList(formData).subscribe((resp: any) => {
          this.nearGroupList = resp.data
          this.near_search_content = data.value['near_search_content']
          this.near_airpark_page = 1
          if(resp.data.length<5)
            this.near_airpark_more   = false
            
          else
            this.near_airpark_more   = true
        })
        break;
      case 2:
        formData = this.api.jsonToFormData(data.value)
        formData.append('page', '1')
        this.api.getMyGroupList(formData).subscribe((resp: any) => {
          this.myGroupList = resp.data
          this.airpark_page = 1
          this.my_search_content = data.value['my_search_content']
          if(resp.data.length<5)
            this.group_more   = false
          else
            this.group_more   = true
          
        })
        break;
    }
  }

  signup_alert() {
    this.alert.error('Please sign up to add Group')
  }

  getImageUrl(data: any): string {
    return this.api.baseUrl + '/group-image/' + data
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
        this.nearGroupList[index].state = 'in progress'
        this.sendRequest(resp.data)
        this.alert.success(resp.msg)
      }
    })
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
  airparks_more(){
    this.airpark_page++
    this.api.getMyGroupList({ my_search_content: this.my_search_content, page: this.airpark_page }).subscribe((resp: any) => {
      if (resp != null) {
        this.myGroupList = this.myGroupList.concat(resp.data);
        if(resp.data.length<5)
          this.group_more   = false

      } else {
        this.myGroupList = [];
        this.group_more   = false
      }
    })
  }

  near_airparks_more(){
    this.near_airpark_page++
    console.log(this.near_search_content)
    console.log(this.near_airpark_page)
    
    this.api.getNearGroupList({ near_search_content: this.near_search_content, page: this.near_airpark_page }).subscribe((resp: any) => {
      if (resp != null) {
        this.nearGroupList = this.nearGroupList.concat(resp.data);
        if(resp.data.length<5)
          this.near_airpark_more   = false
        
      } else {
        this.myGroupList = [];
        this.near_airpark_more   = false
      }
    })
  }

  sendRequest(request) {
    this.socketService.socket.emit('send_request', request);
  }
}