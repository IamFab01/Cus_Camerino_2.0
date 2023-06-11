import { Component, Input, OnInit } from '@angular/core';
import { Employee } from 'src/app/Models/employee';
import { User } from 'src/app/Models/user';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Input() selectedComponent: string | undefined;

  sideBarOpen = true;
  userType : any;
  

   
  constructor(private authUser : UserService) { }

  ngOnInit () {
    this.userType = this.authUser.getUser();
  }


  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
  
}
