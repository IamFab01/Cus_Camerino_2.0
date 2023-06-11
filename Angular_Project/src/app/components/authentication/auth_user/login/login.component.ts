import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/Models/user'
import { environment } from 'src/environments/environments';
import { Router, UrlTree } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  //Variable for FormGroup
  public loginForm !: FormGroup;

  //Variable for associate the response Http when Login is successful.
  response: any;

  /**
   * Constructor for LoginComponent.
   * @param httpClient the HttpClient module for this component.
   * @param formBuilder the formBuilder for all Form and check data in HTML.
   * @param router  the Router module for this component for navigation.
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
      email: ['', Validators.email],
      password: ['', Validators.required]
    });
  }

  //Login method.
  onSubmit() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    this.httpClient.post(`${environment.baseUrl}/user/login`, { email: email, password: password }).subscribe(
      response => {
        this.response = response;
        if (this.response.status == 200) {
          const userLogged = new User(this.response.jsonResponse.id, this.response.jsonResponse.nome, this.response.jsonResponse.cognome, this.response.jsonResponse.email);
          this.userService.setUser(userLogged);
          this.authService.saveToken(this.response.accessToken, this.response.refreshToken);
          this.router.navigate(['dashboard/user']);
        } else {
          alert("Password o email non corretti.");
        }
      }, err => {
        alert('Password o email non corretti.');
      }
    );
  }

}
