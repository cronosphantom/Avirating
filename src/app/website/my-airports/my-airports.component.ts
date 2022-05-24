import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-my-airports',
  templateUrl: './my-airports.component.html',
  styleUrls: ['./my-airports.component.css']
})
export class MyAirportsComponent implements OnInit {

  airports = [];
  airport_page:number = 1;
  airport_more:boolean = true;

  constructor(
    private router: Router,
    public api: ApiService,
    private alert: IAlertService,

  ) { 
    this.api.getHomeAirport().subscribe((resp: any) => {
      if (resp != null) {
          this.api.homeairport = resp.data.airport_id;
          this.api.homeairport_name = resp.data.airport_name;
          this.airports = [{airport_id:this.api.homeairport ,airport_name:this.api.homeairport_name, subscribed_state: 2}]
          this.api.getMyAirports({page: this.airport_page }).subscribe((resp: any) => {
            if (resp != null) {
             
              this.airports = this.airports.concat(resp.data)
              if(resp.data.length<14)
                this.airport_more   = false
              else
                this.airport_more   = true
            } else {
              this.airports = []
              this.airport_more   = false
            }
          })
          
      }
    });
    
  }

  ngOnInit(): void {
    
    

  }

  airports_more(){
    this.airport_page++
    this.api.getMyAirports({ page: this.airport_page }).subscribe((resp: any) => {
      if (resp != null) {
        this.airports = this.airports.concat(resp.data)
        if(resp.data.length<14)
          this.airport_more   = false
        else
          this.airport_more   = true
      } else {
        this.airports = []
        this.airport_more   = false
      }
    })
  }

  toggleSubscribe(airportid: any): any {
    this.airports = [{airport_id:this.api.homeairport, airport_name:this.api.homeairport_name, subscribed_state: 2}]
    this.api.toggleSubscribe({ airport_id: airportid, state: 0 }).subscribe((resp: any) => {
      if (resp.success === true){
        this.api.getMyAirports({ page: 1 }).subscribe((resp: any) => {
          if (resp != null) {
            this.airports = this.airports.concat(resp.data)
            if(resp.data.length<14)
              this.airport_more   = false
            else
              this.airport_more   = true
          } else {
            this.airports = []
            this.airport_more   = false
          }
        })
      }
      
    })
  }

}
