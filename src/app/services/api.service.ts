import { Router } from '@angular/router'
import { ConstantsService } from './constants.service'
import { map } from 'rxjs/operators'
import { apis } from '../../environments/environment'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, BehaviorSubject, Subject } from 'rxjs'

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    public activeTab = ''
    public homeBannerPrice = ''

    showLoading = new Subject<boolean>()
    baseUrl: string
    userSubscriptionName: any
    searchFilter: any
    userLoggedInSource = new BehaviorSubject(false)
    scrollBottom: boolean
    scrollBottomChange = new Subject<boolean>()
    userMembership = new Subject<string>()
    userImage = new Subject<string>()
    userLoggedInObs = this.userLoggedInSource.asObservable()

    user: any = {
        id: 0,
        user_name: '',
        email: '',
        user_type: '',
        api_token: '',
        balance: 0,
        status: ''
    }

    newNotification = 0

    notifications: any =[];
    myGroupList: any =[];
    myAirportList: any = [];
    homeairport:any =[];
    homeairport_name:any =''
    
    constructor(
        public http: HttpClient,
        public cs: ConstantsService
    ) {
        this.baseUrl = apis.baseUrl + '/public'
        this.scrollBottom = false
        this.scrollBottomChange.subscribe((value) => {
            this.scrollBottom = value
        })
        if (localStorage.getItem('apiToken')) {
            this.user = JSON.parse(localStorage.getItem('user'))
            this.userLoggedInSource.next(true)
        } else {
            this.userLoggedInSource.next(false)
        }
    }

    toggleScrollBottom(value: boolean): void {
        this.scrollBottomChange.next(value)
    }

    login(params: any): Observable<any> {
        const url = `${this.baseUrl}/login`

        return this.http.post<any>(url, params)
            .pipe(
                map(resp => {
                    if (resp && resp.success && resp.data.api_token) {
                        localStorage.setItem('apiToken', resp.data.api_token)
                        localStorage.setItem('user', JSON.stringify(resp.data))
                        this.user = resp.data
                        this.userLoggedInSource.next(true)
                    }

                    return resp
                })
            )
    }

    registerBusiness(params: any): Observable<any> {
        const url = `${apis.baseUrl}/business/register`

        return this.http.post<any>(url, params)
        /*   .pipe(
               map(resp => {
                   if (resp && resp.success && resp.data.api_token) {
                       localStorage.setItem('apiToken', resp.data.api_token)
                       localStorage.setItem('user', JSON.stringify(resp.data))
                       this.user = resp.data
                       this.userLoggedInSource.next(true)
                   }

                   return resp
               })
           )*/
    }

    registerCustomer(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/register`

        return this.http.post<any>(url, params)
        /*  .pipe(
              map(resp => {
                  if (resp && resp.success && resp.data.api_token) {
                      localStorage.setItem('apiToken', resp.data.api_token)
                      localStorage.setItem('user', JSON.stringify(resp.data))
                      this.user = resp.data
                      this.userLoggedInSource.next(true)
                  }

                  return resp
              })
          )*/
    }

    getNewNotification(): Observable<any> {
        const url = `${apis.baseUrl}/customer/new-notification`

        return this.http.get<any>(url)
    }

    getAirparkInfo(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/get-airpartInfo`

        return this.http.post<any>(url, params)
    }

    getAirportGroups(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/get-airportGroups`

        return this.http.post<any>(url, params)
    }

    getAirportAviRators(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/get-airportAviRators`

        return this.http.post<any>(url, params)
    }

    getAirportInfo(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/get-airportInfo`

        return this.http.post<any>(url, params)
    }

    getAirportName(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/get-airportName`

        return this.http.post<any>(url, params)
    }

    getHomeAirport(): Observable<any> {
        const url = `${apis.baseUrl}/customer/get-homeairport`

        return this.http.get<any>(url)
    }

    join(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/join`

        return this.http.post<any>(url, params)
    }

    createGroup(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/create-group`

        return this.http.post<any>(url, params)
    }

    
    getMyGroupList(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/get-myGroup`

        return this.http.post<any>(url, params)
    }

    getNearGroupList(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/get-nearGroup`

        return this.http.post<any>(url, params)
    }

    // getPostList(): Observable<any> {
    //     const url = `${apis.baseUrl}/customer/get-postList`

    //     return this.http.get<any>(url)
    // }

    getGroupInfo(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/get-groupInfo`

        return this.http.post<any>(url, params);
    }

    getGroupPost(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/get-groupPosts`

        return this.http.post<any>(url, params);
    }
   

    getCustomerInfo(params: any):Observable<any>{
        const url = `${apis.baseUrl}/customer/get-customerInfo`

        return this.http.post<any>(url, params);
    }
    
    getCustomerPost(params: any):Observable<any>{
        const url = `${apis.baseUrl}/customer/get-customerPost`

        return this.http.post<any>(url, params);
    }

    addFriend(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/add-friend`

        return this.http.post<any>(url, params);
    }

    getCustomerPosts(params: any):Observable<any>{
        const url = `${apis.baseUrl}/customer/get-customerPosts`

        return this.http.post<any>(url, params);
    }

    getCustomerReplies(params: any):Observable<any>{
        const url = `${apis.baseUrl}/customer/get-customerReplies`

        return this.http.post<any>(url, params);
    }

    getCustomerLikes(params: any):Observable<any>{
        const url = `${apis.baseUrl}/customer/get-customerLikes`

        return this.http.post<any>(url, params);
    }

    getCustomerReviews(params: any):Observable<any>{
        const url = `${apis.baseUrl}/customer/get-customerReviews`

        return this.http.post<any>(url, params);
    }

    getCustomerAirparks(params: any):Observable<any>{
        const url = `${apis.baseUrl}/customer/get-customerAirparks`

        return this.http.post<any>(url, params);
    }

    getCustomerImages(params: any):Observable<any>{
        const url = `${apis.baseUrl}/customer/get-customerImages`

        return this.http.post<any>(url, params);
    }

    getCustomerVideos(params: any):Observable<any>{
        const url = `${apis.baseUrl}/customer/get-customervideos`

        return this.http.post<any>(url, params);
    }


    getActivityInfo(params: any):Observable<any>{
        const url = `${apis.baseUrl}/customer/get-activityInfo`

        return this.http.post<any>(url, params);
    }
   
    getRequests(): Observable<any> {
        const url = `${apis.baseUrl}/customer/get-requests`

        return this.http.get<any>(url);
    }

  
    JoinRequest(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/join-request`

        return this.http.post<any>(url, params);
    }


    approveJoinRequest(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/approve-joinRequest`

        return this.http.post<any>(url, params);
    }

    rejectJoinRequest(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/reject-joinRequest`

        return this.http.post<any>(url, params);
    }

    approveFriendRequest(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/approve-friendRequest`

        return this.http.post<any>(url, params);
    }

    rejectFriendRequest(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/reject-friendRequest`

        return this.http.post<any>(url, params);
    }

    
    friendRequest(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/friend-request`

        return this.http.post<any>(url, params);
    }

    

    toggleSubscribe(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/toggle-subscribe`

        return this.http.post<any>(url, params);
    }

    getAirports(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/get-airports2`

        return this.http.post<any>(url, params)
    }

    getAirportsCard(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/get-airports`

        return this.http.post<any>(url, params)
    }

    doUserRedirects(resp: any, router: Router) {
        switch (resp.data.user_type) {
            case 'customer': {
                router.navigate(['/customer/profile'])
                break
            }
            case 'business': {
                router.navigate(['/business-owner/profile'])
                break
            }
            case 'admin': {
                router.navigate(['/admin/dashboard'])
                break
            }
        }
    }

    logOut(): boolean {
        localStorage.removeItem('apiToken')
        localStorage.removeItem('user')
        this.user.id = 0
        this.userLoggedInSource.next(false)

        return true
    }

    isAuthenticated(): boolean {
        if (localStorage.getItem('apiToken')) {
            return true
        } else {
            return false
        }
    }

    isCustomer(): boolean {
        if (this.isAuthenticated() && this.user.user_type === ConstantsService.USER_ROLES.CUSTOMER) {
            return true
        } else {
            return false
        }
    }

    isBusinessOwner(): boolean {
        if (this.isAuthenticated() && this.user.user_type === ConstantsService.USER_ROLES.BUSINESS_OWNER) {
            return true
        } else {
            return false
        }
    }

    isAdmin(): boolean {
        if (this.isAuthenticated() && this.user.user_type === ConstantsService.USER_ROLES.ADMIN) {
            return true
        } else {
            return false
        }
    }

    // public Api call
    getCountries(noLoader?: boolean): Observable<any> {
        const loader = noLoader === true ? '?no-loader=true' : ''
        const url = `${this.baseUrl}/lov/countries-list${loader}`

        return this.http.get<any>(url)
    }

    getCounty(id): Observable<any> {
        const url = `${this.baseUrl}/lov/country/${id}`

        return this.http.get<any>(url)
    }

    getProvinces(countryid: number, param?: { [param: string]: string }): Observable<any> {
        const url = `${this.baseUrl}/lov/provinces-list/${countryid}`

        return this.http.get<any>(url, { params: param })
    }

    getCities(provinceid: number, param?: { [param: string]: string }): Observable<any> {
        const url = `${this.baseUrl}/lov/cities-list/${provinceid}`

        return this.http.get<any>(url, { params: param })
    }

    getCitiesAll(): Observable<any> {
        const url = `${this.baseUrl}/lov/cities-list-all`

        return this.http.get<any>(url)
    }

    getSuburbans(cityid: number, param?: { [param: string]: string }): Observable<any> {
        const url = `${this.baseUrl}/lov/suburbans-list/${cityid}`

        return this.http.get<any>(url, { params: param })
    }

    getPropertyType(): Observable<any> {
        const url = `${this.baseUrl}/lov/property-type-list`

        return this.http.get<any>(url)
    }

    getAmenity(): Observable<any> {
        const url = `${this.baseUrl}/lov/amenity-list`

        return this.http.get<any>(url)
    }

    getDistanceUnits(): Observable<any> {
        const url = `${this.baseUrl}/lov/distance-unit-list`

        return this.http.get<any>(url)
    }

    getReferenceLocation(): Observable<any> {
        const url = `${this.baseUrl}/lov/refer-location-list`

        return this.http.get<any>(url)
    }

    getPropertySearch(pageNumber: number, postData: any): Observable<any> {
        const url = `${this.baseUrl}/search-properties?page=${pageNumber}`
        // const url = `${this.baseUrl}/search-properties`


        return this.http.post<any>(url, postData)
    }

    agentListPublic(): Observable<any> {
        const url = `${this.baseUrl}/agent-list`

        return this.http.get<any>(url)
    }

    agentList(): Observable<any> {
        const url = `${apis.baseUrl}/agency/agent/agent-list`

        return this.http.get<any>(url)
    }

    saveContactUs(postData): Observable<any> {
        const url = `${this.baseUrl}/contact-us`

        return this.http.post<any>(url, postData)
    }

    jsonToFormData(jsonObject: object, parentKey?: any, carryFormData?: FormData): FormData {

        const formData = carryFormData || new FormData()
        let index = 0

        // tslint:disable-next-line: forin
        for (const key in jsonObject) {
            if (jsonObject.hasOwnProperty(key)) {
                if (jsonObject[key] !== null && jsonObject[key] !== undefined) {
                    let propName = parentKey || key
                    if (parentKey && this.isObject(jsonObject)) {
                        propName = parentKey + '[' + key + ']'
                    }
                    if (parentKey && this.isArray(jsonObject)) {
                        propName = parentKey + '[' + index + ']'
                    }
                    if (jsonObject[key] instanceof File) {
                        formData.append(propName, jsonObject[key])
                    } else if (jsonObject[key] instanceof FileList) {
                        for (let j = 0; j < jsonObject[key].length; j++) {
                            formData.append(propName + '[' + j + ']', jsonObject[key].item(j))
                        }
                    } else if (this.isArray(jsonObject[key]) || this.isObject(jsonObject[key])) {
                        this.jsonToFormData(jsonObject[key], propName, formData)
                    } else if (typeof jsonObject[key] === 'boolean') {
                        formData.append(propName, +jsonObject[key] ? '1' : '0')
                    } else {
                        formData.append(propName, jsonObject[key])
                    }
                }
            }
            index++
        }

        return formData
    }

    isArray(val: any) {
        const toString = ({}).toString

        return toString.call(val) === '[object Array]'
    }

    isObject(val: any) {
        return !this.isArray(val) && typeof val === 'object' && !!val
    }

    searchableLocations(keyword: string, noLoader?: boolean): Observable<any> {
        const loader = noLoader === true ? '?no-loader=true' : ''
        const url = `${apis.baseUrl}/public/searchable-locations/${keyword}${loader}`

        return this.http.get<any>(url)
    }

    checkVerificationCode(data): Observable<any> {
        const url = `${this.baseUrl}/verify-email`

        return this.http.post<any>(url, data)
    }

    resendVerificationCode(data): Observable<any> {
        const url = `${this.baseUrl}/resend-code`

        return this.http.post<any>(url, data)
    }

    replyImageUrl(imageId?: number) {
        imageId = imageId ? imageId : -1

        return `${apis.baseUrl}/public/reply-image/${imageId}`
    }

    reviewImageUrl(imageId?: number) {
        imageId = imageId ? imageId : -1

        return `${apis.baseUrl}/public/review-image/${imageId}`
    }

    // Profile update
    userImageUrl(userId?: number) {
        userId = userId ? userId : -1

        return `${apis.baseUrl}/public/profile-image/${userId}`
    }

    membershipImageUrl(Id?: number) {
        Id = Id ? Id : -1

        return `${apis.baseUrl}/public/membership-image/${Id}`
    }
    //
    categoryImageUrl(id?: number) {
        id = id ? id : -1

        return `${apis.baseUrl}/public/business-category-image/${id}`
    }

    checkResetCode(data): Observable<any> {
        const url = `${this.baseUrl}/verify-code`

        return this.http.post<any>(url, data)
    }

    getUserMembership(): Observable<any> {

        const url = `${this.baseUrl}/user-membership`

        return this.http.post<any>(url, {})
    }

    resetPass(data): Observable<any> {
        const url = `${this.baseUrl}/reset-password`

        return this.http.post<any>(url, data)
    }

    listingSmallThumbnailUrl(productId?: number) {
        productId = productId ? productId : -1

        return `${apis.baseUrl}/public/listing-small-thumbnail/${productId}`
    }

    servicesList(): Observable<any> {
        const url = `${this.baseUrl}/services`

        return this.http.get<any>(url)
    }

    amenityList(): Observable<any> {
        const url = `${this.baseUrl}/amenities`

        return this.http.get<any>(url)
    }

    businessCategoriesList(): Observable<any> {
        const url = `${this.baseUrl}/business-categories`

        return this.http.get<any>(url)
    }

    businessTypeList(): Observable<any> {
        const url = `${this.baseUrl}/business-types`

        return this.http.get<any>(url)
    }
    
    listings(params: any): Observable<any> {
        const url = `${this.baseUrl}/listings`

        return this.http.get<any>(url, { params })
    }

    businessListings(params: any): Observable<any> {
        const url = `${this.baseUrl}/businesses-list`

        return this.http.get<any>(url, { params })
    }

    businessRequests(): Observable<any> {
        const url = `${this.baseUrl}/business-requests`

        return this.http.get<any>(url)
    }

    listingDetails(param: any): Observable<any> {
        const url = `${this.baseUrl}/listing-detail`

        return this.http.post<any>(url, param)
    }

    getListingImageUrl(id: number) {

        return `${apis.baseUrl}/public/listing-image/${id}`
    }

    businessProfile(id: any): Observable<any> {
        const url = `${this.baseUrl}/business/${id}`

        return this.http.get<any>(url)
    }

    addBusiness(params: any): Observable<any> {
        const url = `${apis.baseUrl}/public/add-business`

        return this.http.post<any>(url, params)
    }

    claimBusiness(params: any): Observable<any> {
        const url = `${apis.baseUrl}/business/claim-business`

        return this.http.post<any>(url, params)
    }

    bannerImageUrl(eventId?: number) {
        eventId = eventId ? eventId : -1

        return `${apis.baseUrl}/public/banner-image/${eventId}`
    }

    getSettings(): Observable<any> {
        const url = `${this.baseUrl}/settings`

        return this.http.get<any>(url)
    }
    /////////////// post  ///////////////////

     
    getSubscribedAirport(): Observable<any> {
        const url = `${apis.baseUrl}/customer/get-subscribedAirports`

        return this.http.get<any>(url)
    }

    sendReport(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/report`

        return this.http.post<any>(url, params)
    }

    createPost(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/create-post`

        return this.http.post<any>(url, params)
    }

    createPost_Group(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/create-group-post`
        return this.http.post<any>(url, params)
    }
    
    createComment(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/create-comment`

        return this.http.post<any>(url, params)
    }

    createComment_Group(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/create-group-comment`

        return this.http.post<any>(url, params)
    }

    createReply(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/create-reply`

        return this.http.post<any>(url, params)
    }
    
    createReply_Group(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/create-group-reply`

        return this.http.post<any>(url, params)
    }

    postLike(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/post-like`

        return this.http.post<any>(url, params);
    }

    postLike_Group(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/post-group-like`

        return this.http.post<any>(url, params);
    }

    commentLike(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/comment-like`

        return this.http.post<any>(url, params);
    }

    commentLike_Group(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/comment-group-like`

        return this.http.post<any>(url, params);
    }

    replyLike(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/reply-like`

        return this.http.post<any>(url, params);
    }

    replyLike_Group(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/reply-group-like`

        return this.http.post<any>(url, params);
    }

    getGroupImageUrl(eventId?: number): string {
        eventId = eventId ? eventId : -1
        return `${apis.baseUrl}/public/group-image/${eventId}`
    }
    
    getUserImageUrl(eventId?: number): string {
        eventId = eventId ? eventId : -1
        return `${apis.baseUrl}/public/profile-image/${eventId}`
    }

    getVideoUrl(eventId?: number): string {
        eventId = eventId ? eventId : -1
        return `${apis.baseUrl}/public/post-video/${eventId}`
    }

    getPosts(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/get-posts`
        return this.http.post<any>(url, params);
    }

    getAirportPosts(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/get-airportPosts`
        return this.http.post<any>(url, params);
    }

    /////////////// profile //////////////
    getCustomerAirports(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/get-customerAirports`
        return this.http.post<any>(url, params);
    }

    getMyAirports(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/get-myAirports`
        return this.http.post<any>(url, params);
    }

    getMyfriends(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/get-myFriends`
        return this.http.post<any>(url, params);
    }


    getPostThumbImageUrl(eventId?: number): string {
        eventId = eventId ? eventId : -1
        return `${apis.baseUrl}/public/post-img-thumb/${eventId}`
    }
    
    getPostThumbVideoUrl(eventId?: number): string {
        eventId = eventId ? eventId : -1
        return `${apis.baseUrl}/public/post-video-thumb/${eventId}`
    }

    getPostImageUrl(eventId?: number): string {
        eventId = eventId ? eventId : -1
        return `${apis.baseUrl}/public/post-image/${eventId}`
    }
    
    getPostVideoUrl(eventId?: number): string {
        eventId = eventId ? eventId : -1
        return `${apis.baseUrl}/public/post-video/${eventId}`
    }

    
}
