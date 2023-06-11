import { Component, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Employee } from 'src/app/Models/employee';
import { User } from 'src/app/Models/user';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {

  hasChild = false;
  userType : any;
  

  constructor(private router: Router, private authUser : UserService) { }

  ngOnInit() {
    this.userType = this.authUser.getUser();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.hasChild = this.router.url.includes('/');
      }
    });
  }

}
