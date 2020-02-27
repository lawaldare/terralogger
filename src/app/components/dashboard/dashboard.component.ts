import { environment } from './../../../environments/environment';
import { LoggerService } from './../../service/logger.service';
import { Component, OnInit, ElementRef, AfterViewInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Terminal } from "xterm";


declare const gapi: any;



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, AfterViewInit {

  @ViewChild('myTerminal', { static: false }) terminalDiv: ElementRef;
  public term: Terminal;

  apps: string[];
  environs: string = 'production';
  app: string;
  logs: any = [];
  hasFetchedLogs: boolean = false;
  latestLogTimestamp: number = 0;



  private clientId: string = '964206322532-v59qjfa681o6n4lpviatk8vkjv2cus6t.apps.googleusercontent.com';

  private scope = [
    'profile',
    'email',
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/contacts.readonly',
    'https://www.googleapis.com/auth/admin.directory.user.readonly'
  ].join(' ');

  public auth2: any;


  email;
  constructor(private element: ElementRef, public loggerService: LoggerService, private router: Router) {
    this.getEmail();
  }

  ngOnInit() {
    this.getApps();
    this.keepFetchingLogs();
  }

  ngAfterViewInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: this.clientId,
        cookie_policy: 'single_host_origin',
        scope: this.scope
      });
    });
    this.term = new Terminal();
    this.term.open(this.terminalDiv.nativeElement);
    this.term.writeln('Please select an app and environment');

  }

  signOut() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.getAuthInstance();
      this.auth2.signOut().then(() => {
        localStorage.clear();
        this.router.navigate(['/home'])
      })
    })
  }

  getEmail() {
    this.email = this.loggerService.getUserEmail();
  }

  getApps() {
    this.loggerService.getApps().subscribe(data => {
      this.apps = data;
    })
  }

  getApp(event) {
    this.app = event.target.value;
    this.getLogs(this.app, this.environs);
  }

  getEnvironment(event) {
    this.environs = event.target.value;
    this.getLogs(this.app, this.environs);
  }

  getLogs(app: string, environment: string, from?: number) {
    this.hasFetchedLogs = false;
    this.loggerService.getLogs(app, environment, from).subscribe(data => {
      this.logs = data;
      if (!from) //dont reset if looping
        this.term.reset();
      for (let a of this.logs) {
        this.term.writeln(a.message);
        this.term.writeln("");
      }
      this.hasFetchedLogs = true;
      if (this.logs.length > 0) {
        this.latestLogTimestamp = this.logs[this.logs.length - 1].timestamp;

      }
    })
  }

  keepFetchingLogs() {
    setInterval(() => {
      if (this.hasFetchedLogs && !document.hidden) {
        console.log("fetching logs");
        this.getLogs(this.app, this.environs, this.latestLogTimestamp);
      }
    }, 2000);
  }



}
