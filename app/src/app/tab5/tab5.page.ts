import { Component, ViewChild } from '@angular/core';
import { AppBase } from '../AppBase';
import { Router } from '@angular/router';
import {  ActivatedRoute, Params } from '@angular/router';
import { NavController, ModalController, ToastController, AlertController, NavParams,IonSlides } from '@ionic/angular';
import { AppUtil } from '../app.util';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-tab5',
  templateUrl: 'tab5.page.html',
  styleUrls: ['tab5.page.scss']
})
export class Tab5Page extends AppBase {

  constructor(public router: Router,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public activeRoute: ActivatedRoute,
    private sanitizer: DomSanitizer) {
    super(router, navCtrl, modalCtrl, toastCtrl, alertCtrl,activeRoute);
    this.headerscroptshow = 480;
    this.currentpage="tab5";
  }

  onMyShow(){
    AppBase.TABName="tab5";
    AppBase.LASTTAB=this;
  }

  
  tryLogin() {
    if (this.MemberInfo == null) {
      this.navigate("/mobilelogin");
    }else{
      this.navigate("/memberinfo");
    }
  }
  tryLogout(){
    this.showConfirm("是否确定退出账号？",(res)=>{
      if(res){
        this.logout();
        this.tryLogin();
      }
    });
  }
}
