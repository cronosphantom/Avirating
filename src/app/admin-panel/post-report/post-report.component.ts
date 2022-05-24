import { Component, OnInit} from '@angular/core';
import { IAlertService } from 'src/app/libs/ialert/ialerts.service';
import { ApiService } from 'src/app/services/api.service'
import { AdminApiService } from 'src/app/services/admin-api.service'
@Component({
  selector: 'app-post-report',
  templateUrl: './post-report.component.html',
  styleUrls: ['./post-report.component.css']
})
export class PostReportComponent implements OnInit {

  content:string ="aasasdasd asdasd "
  
  postReports:any =[]
  postReport_page:number =1
  postReport_more:boolean = true 

  commentReports:any =[]
  commentReport_page:number =1
  commentReport_more:boolean = true 

  replyReports:any =[]
  replyReport_page:number =1
  replyReport_more:boolean = true 

  constructor(
    public api: ApiService,
    private adminApi: AdminApiService,
    private alert: IAlertService,
  ) { 
    
  }

  ngOnInit(): void {
    this.adminApi.getReportData({page: this.postReport_page, report_type:'post' }).subscribe((resp: any) => {
      if (resp != null) {
        this.postReports = resp.data
        if(resp.data.length<10)
          this.postReport_more   = false
        else
          this.postReport_more   = true
      } else {
        this.postReports = []
        this.postReport_more   = false
      }
    })
    
    this.adminApi.getReportData({page: this.commentReport_page, report_type:'comment' }).subscribe((resp: any) => {
      if (resp != null) {
        this.commentReports = resp.data
        if(resp.data.length<10)
          this.commentReport_more   = false
        else
          this.commentReport_more   = true
      } else {
        this.commentReports = []
        this.commentReport_more   = false
      }
    })

    this.adminApi.getReportData({page: this.replyReport_page, report_type:'reply' }).subscribe((resp: any) => {
      if (resp != null) {
        this.replyReports = resp.data
        if(resp.data.length<10)
          this.replyReport_more   = false
        else
          this.replyReport_more   = true
      } else {
        this.replyReports = []
        this.replyReport_more   = false
      }
    })
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


  approveReport(id: any, report_id:any, type: any, index: any): any {
    switch (type) {
      case 'post': {
        const param = {
          p_id: id,
          report_id: report_id,
          report_type:'post'
        }
        this.adminApi.approveReport(param).subscribe((resp: any) => {
          if (resp.success === false) {
            this.alert.error("error")
          } else {
            this.postReports.splice(index, 1);
            this.alert.success('approved')
          }
        })
        break
      }
      case 'comment': {
        const param = {
          p_id: id,
          report_id: report_id,
          report_type:'comment'
        }
        this.adminApi.approveReport(param).subscribe((resp: any) => {
          if (resp.success === false) {
            this.alert.error("error")
          } else {
            this.commentReports.splice(index, 1);
            this.alert.success('approved')
          }
        })
        break
      }
      case 'reply': {
        const param = {
          p_id: id,
          report_id: report_id,
          report_type:'reply'
        }
        this.adminApi.approveReport(param).subscribe((resp: any) => {
          if (resp.success === false) {
            this.alert.error("error")
          } else {
            this.replyReports.splice(index, 1);
            this.alert.success('approved')
          }
        })
        break
      }
    }
  }

  rejectReport(id: any, type: any, index: any): any {
    switch (type) {
      case 'post': {
        const param = {
          report_id: id,
        }
        this.adminApi.rejectReport(param).subscribe((resp: any) => {
          if (resp.success === false) {
            this.alert.error("error")
          } else {
            this.postReports.splice(index, 1);
            this.alert.success('rejected')
          }
         
        })
        break
      }
      case 'comment': {
        const param = {
          report_id: id,
        }
        this.adminApi.rejectReport(param).subscribe((resp: any) => {
          if (resp.success === false) {
            this.alert.error("error")
          } else {
            this.commentReports.splice(index, 1);
            this.alert.success('rejected')
          }
         
        })
        break
      }
      case 'reply': {
        const param = {
          report_id: id,
        }
        this.adminApi.rejectReport(param).subscribe((resp: any) => {
          if (resp.success === false) {
            this.alert.error("error")
          } else {
            this.replyReports.splice(index, 1);
            this.alert.success('rejected')
          }
        
        })
        break
      }
    }

  }

  postReports_more(){
    this.postReport_page++
    this.adminApi.getReportData({page: this.postReport_page, report_type:'post' }).subscribe((resp: any) => {
      if (resp != null) {
        this.postReports = this.postReports.concat(resp.data)
        if(resp.data.length<10)
          this.postReport_more   = false
        else
          this.postReport_more   = true
      } else {
        this.postReports = []
        this.postReport_more   = false
      }
    })
  }

  commentReports_more(){
    this.commentReport_page++
    this.adminApi.getReportData({page: this.commentReport_page, report_type:'comment' }).subscribe((resp: any) => {
      if (resp != null) {
        this.commentReports = this.commentReports.concat(resp.data)
        if(resp.data.length<10)
          this.commentReport_more   = false
        else
          this.commentReport_more   = true
      } else {
        this.commentReports = []
        this.commentReport_more   = false
      }
    })
  }

  replyReports_more(){
    this.replyReport_page++
    this.adminApi.getReportData({page: this.replyReport_page, report_type:'reply' }).subscribe((resp: any) => {
      if (resp != null) {
        this.replyReports = this.replyReports.concat(resp.data)
        if(resp.data.length<10)
          this.replyReport_more   = false
        else
          this.replyReport_more   = true
      } else {
        this.replyReports = []
        this.replyReport_more   = false
      }
    })
  }
}
