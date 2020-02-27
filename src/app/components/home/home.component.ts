import { LoggerService } from './../../service/logger.service';
import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';


declare const gapi: any;



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  private clientId: string = '964206322532-v59qjfa681o6n4lpviatk8vkjv2cus6t.apps.googleusercontent.com';

  private scope = [
    'profile',
    'email',
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/contacts.readonly',
    'https://www.googleapis.com/auth/admin.directory.user.readonly'
  ].join(' ');

  public auth2: any;


  constructor(private element: ElementRef, private router: Router, private loggerService: LoggerService) {
    // console.log('ElementRef: ', this.element);
  }

  ngOnInit() { }

  ngAfterViewInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: this.clientId,
        cookie_policy: 'single_host_origin',
        scope: this.scope
      });
      this.attachSignin(this.element.nativeElement.firstChild.children[1]);
    });
  }

  public attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {
        const token = googleUser.getAuthResponse().id_token;
        let profile = googleUser.getBasicProfile();
        this.loggerService.saveUserEmail(profile['zu']);
        this.loggerService.saveUserId(profile.getId());
        this.loggerService.saveUserToken(token);
        this.router.navigate(['dashboard']);
        // ...
      }, function (error) {
        console.log(JSON.stringify(error, undefined, 2));
      });
  }



}
