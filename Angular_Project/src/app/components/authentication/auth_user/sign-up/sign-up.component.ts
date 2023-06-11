import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {

  //Variable for FormGroup.
  public signupForm !: FormGroup;

  //Variable for associate the response Http when Registration is successful
  response: any;

  /**
   * Constructor for this Component. 
   * @param formBuilder the FormBuilder for all Form and check data in HTML. 
   * @param httpClient the HttpClient module for this component.
   * @param router the Router module for this component for navigation.
   */
  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private router: Router
  ) { }

  //NgOnInit implementation
  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    },
    )
  }

  /**
   * Method for registration the new User.
   */
  onSubmit() {
    const fullname = this.signupForm.value.fullname;
    const lastname = this.signupForm.value.lastname;
    const email = this.signupForm.value.email;
    const password = this.signupForm.value.password;
    this.httpClient.post(`${environment.baseUrl}/user/registration`, {
      nome: fullname,
      cognome: lastname,
      email: email,
      password: password
    }).subscribe(
      response => {
        this.response = response;
        if (this.response.status == 201) {
          alert("Registrazione avvenua con successo.");
          this.router.navigate(['/login-user']);
          this.resetForm();
        }
      }
    );
  }

  //This method reset the form value of FormGroup.
  resetForm() {
    this.signupForm.reset();
  }
}
