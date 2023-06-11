import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environments';
import { Employee } from 'src/app/Models/employee';
import { UserService } from 'src/app/service/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-emp',
  templateUrl: './login-emp.component.html',
  styleUrls: ['./login-emp.component.scss']
})
export class LoginEmpComponent implements OnInit {

  //variable for FormGroup
  public loginForm !: FormGroup;

  //Variable for associate the response Http when Login is successful.
  data: any;

  /**
   * Constructor for this Component.
   * @param httpClient  the HttpClient module for this component.
   * @param formBuilder the formBuilder for all Form and check data in HTML.
   * @param router the Router module for this component for navigation.
   * @param userService service for send Data (User) to other Components.
   */
  constructor(
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) { }

  //NgOnInit implementation.
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      code: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  //Login method.
  onSubmit() {
    const code = this.loginForm.value.code;
    const password = this.loginForm.value.password;
    this.httpClient.post(`${environment.baseUrl}/employee/login`, {
      codice: code,
      password: password
    }).subscribe(
      response => {
        this.data = response;
        if (this.data.status == 200) { //login success
          const employeeLogged = new Employee(this.data.jsonResponse.id, this.data.jsonResponse.nome, this.data.jsonResponse.codice, this.data.jsonResponse.restrizioni);
          this.userService.setUser(employeeLogged);
          this.authService.saveToken(this.data.accessToken, this.data.refreshToken);
          this.router.navigate(['dashboard/employee']);
        } else {
          alert("Password non corretta.");
        }
      }, err => {
        alert('Password non corretta.');
      }
    );
  }
}
