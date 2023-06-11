import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Card } from 'src/app/Models/card';
import { Employee } from 'src/app/Models/employee';
import { UserService } from 'src/app/service/user.service';
import { environment } from 'src/environments/environments';
import { User } from 'src/app/Models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/components/authentication/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {



  //GENERAL VARIABLES 

  //This is the variable for the FormGroup.
  form !: FormGroup;

  //This is the variable for associated the User access account. (User or Employee).
  userType: User | Employee | undefined;

  //This is the variable, that indicates if the User is User or Employee, for determinate the div page. 
  isEmployee: boolean | undefined;

  //This is a variable, to associate all Http response.
  data: any;



  //-----VARIABLES FOR EMPLOYEE-----

  //Variables that rapresent all Card of Users.
  allCards: Card[] = [];

  //Variable that indicates if Employee search Card of specific User.
  searchedCard = false;

  //Variable that rapresent the Card searched if exists.
  cardCercata: Card | undefined;

  showFormAddCard = false;

  showFormSearchCard = false;

  showFormAddPoints = false;

  showFormRemovePoints = false;



  //------VARIABLES FOR USER-------

  //Variable that rapresent the User Card.
  cardUser: Card | undefined;

  //Variable that rapresent if the User have card.
  haveCard = false;



  /**
   * Constructor for this Component. 
   * @param httpClient the HttpClient object.
   * @param userService the UserService for get the User/Employee logged.
   * @param formBuilder the FormBuilder object for the Forms.
   */
  constructor(
    private httpClient: HttpClient,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) { }

  //NgOnInit implementation.
  ngOnInit(): void {
    this.initForm();
    this.userType = this.userService.getUser();
    if (this.userType instanceof Employee) {
      this.isEmployee = true;
      this.getAllCardUsers();
    } else if (this.userType instanceof User) {
      this.isEmployee = false;
      this.getCardUser();
    }
  }

  //This is the method for init the FormGroup. 
  initForm() {
    this.form = this.formBuilder.group({
      codice: ['', Validators.required],
      punti: ['', Validators.required],
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      nuovoCodice: ['', Validators.required],
    });
  }

  //This is the method for reset the FormGroup value.
  resetForm() {
    this.form.reset();
  }

  //This is the method for reset the Data from backend.
  resetData() {
    this.data = null;
  }

  //This method rebuild the page.
  reloadPage() {
    this.ngOnInit();
  }


  //-----EMPLOYEE METHODS------

  //This method get all Card Users.
  getAllCardUsers() {
    const token = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
    this.httpClient.get<any>(`${environment.baseUrl}/card/findAll`, httpOptions).subscribe(
      response => {
        this.data = response;
        if (this.data.status == 200) {
          this.allCards = this.data.data;
        }
      }, err => {
        this.data = err;
        if (this.data.status == 404) {
          alert("Impossibile caricare la pagina. Riprova.");
          this.resetData();
          return;
        } else if (this.data.status == 500) {
          alert("Something went wrong while fetching data. Please try again later.");
          this.resetData();
          return;
        }
      });
    this.resetData();
    this.resetForm();
  }

  //This method allows you to create a new Card.
  createCard() {
    const nome = this.form.value.nome;
    const cognome = this.form.value.cognome;
    const codice = this.form.value.nuovoCodice;
    const token = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
    this.httpClient.post(`${environment.baseUrl}/card/create`, { nome: nome, cognome: cognome, codice: codice }, httpOptions).subscribe(
      response => {
        this.data = response;
        if (this.data.status == 201) {
          alert("Card creata correttamente.");
          this.getAllCardUsers();
          this.closeCreateForm();
        }
      }, err => {
        this.data = err;
        if (this.data.status == 400) {
          alert("Campi vuoti. Operazione non valida.");
          this.closeCreateForm();
        } else if (this.data.status == 402) {
          alert("L'utente possiede già la Tessera.");
          this.closeCreateForm();
        } else if (this.data.status == 404) {
          alert("Utente non trovato.");
          this.closeCreateForm();
        }
      });
  }

  closeCreateForm() {
    this.showFormAddCard = false;
    this.resetData();
    this.resetForm();
  }

  //This method allows you to search a Card.
  searchCard() {
    const nome = this.form.value.nome;
    const cognome = this.form.value.cognome;
    for (let card of this.allCards) {
      if (card.owner.nome == nome && card.owner.cognome == cognome) {
        this.cardCercata = card;
        this.searchedCard = true;
        this.showFormSearchCard = false;
      }
    }
    this.resetForm()
  }

  //This method close the Search Card.
  closeSearchedCard() {
    this.showFormSearchCard = false;
    this.searchedCard = false;
    this.cardCercata = undefined;
    this.resetForm();
  }


  /**
   * This method allows you to add a specific number of point into one Card.
   */
  addPointsCard() {
    const token = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
    const codice = this.form.value.codice;
    const punti = this.form.value.punti;
    this.httpClient.post(`${environment.baseUrl}/card/addPoints`, { codice: codice, punti: punti }, httpOptions).subscribe(
      response => {
        this.data = response;
        if (this.data.status == 200) {
          alert("Punti aggiunti correttamente!");
          this.closeAddPoints();
          this.getAllCardUsers();
        }
      }, err => {
        this.data = err;
        if (this.data.status == 400) {
          alert("Campi vuoti. Operazione non valida. Riprova");
          return;
        } else if (this.data.status == 500) {
          alert("Something went wrong. Please try again later.");
          this.closeAddPoints();
        }
      }
    );
    this.closeAddPoints();
  }


  /**
   * This method allows you to add points into all Card.
   */
  addPointsAll() {
    const punti = this.form.value.punti;
    const token = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
    this.httpClient.post(`${environment.baseUrl}/card/addPointsAll`, { punti: punti }, httpOptions).subscribe(
      response => {
        this.data = response;
        if (this.data.status == 200) {
          alert("Punti aggiunti correttamente!");
          this.closeAddPoints();
          this.getAllCardUsers();
        }
      }, err => {
        this.data = err;
        if (this.data.status == 400) {
          alert("Campi vuoti. Operazione non valida. Riprova");
          return;
        } else if (this.data.status == 500) {
          alert("Something went wrong. Please try again later.");
          this.closeAddPoints();
        }
      });
    this.closeAddPoints();
  }

  closeAddPoints() {
    this.showFormAddPoints = false;
    this.resetData();
    this.resetForm();
  }


  /**
   * This method allows you to remove a specific point from a Card.
   */
  removePointsCard() {
    const token = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
    const codice = this.form.value.codice;
    const punti = this.form.value.punti;
    this.httpClient.post(`${environment.baseUrl}/card/removePoints`, { codice: codice, punti: punti }, httpOptions).subscribe(
      response => {
        this.data = response;
        if (this.data.status == 200) {
          alert("Punti rimossi con successo.");
          this.closeRemovePoints();
          this.getAllCardUsers();
        }
      }, err => {
        this.data = err;
        if (this.data.status == 400) {
          alert("Campi vuoti. Operazione non valida. Riprova");
          return;
        } else if (this.data.status == 500) {
          alert("Something went wrong. Please try again later.");
          this.closeRemovePoints();
        }
      }
    );
    this.closeRemovePoints();
  }


  /**
   * This method allows you to remove points from all Cards.
   */
  removePointsAll() {
    const token = localStorage.getItem('accessToken');
    const punti = this.form.value.punti;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
    this.httpClient.post(`${environment.baseUrl}/card/removePointsAll`, { punti: punti }, httpOptions).subscribe(
      response => {
        this.data = response;
        if (this.data.status == 200) {
          alert("Punti rimossi con successo.");
          this.closeRemovePoints();
          this.getAllCardUsers();
        }
      }, err => {
        this.data = err;
        if (this.data.status == 400) {
          alert("Campi vuoti. Operazione non valida. Riprova");
          return;
        }
      });
    this.closeRemovePoints();
  }


  closeRemovePoints() {
    this.showFormRemovePoints = false;
    this.resetData();
    this.resetForm();
  }


  //This method allows you to remove a Card by id number.
  removeCard(id: Number) {
    const token = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
    this.httpClient.post(`${environment.baseUrl}/card/delete/${id}`, {}, httpOptions).subscribe(
      response => {
        this.data = response;
        if (this.data.status == 200) {
          alert("Card rimossa con successo.");
          this.getAllCardUsers();
        }
      }, err => {
        this.data = err;
        if (this.data.status == 400) {
          alert("Errore con la rimozione. Riprova.");
          this.resetData();
          this.resetForm();
          return;
        } else if (this.data.status == 500) {
          alert("Something went wrong. Please try again later.");
          this.resetData();
          this.resetForm();
          return;
        }
      });
  }



  //-----USER METHODS----------

  //Method that get the Card for specific User logged.
  getCardUser() {
    if (this.userType) {
      const token = localStorage.getItem('accessToken');
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + token
        })
      };
      this.httpClient.get<any>(`${environment.baseUrl}/card/findCardUser/${this.userType.id}`, httpOptions).subscribe(
        response => {
          this.data = response;
          if (this.data.status == 200) {
            this.cardUser = this.data.data;
            this.haveCard = true;
            this.resetData();
          } else if (this.data.status == 404) {
            this.haveCard = false;
          }
        }, err => {
          this.data = err;
          if (this.data.status == 404) {
            this.haveCard = false;
          } else if (this.data.status == 500) {
            alert("Something went wrong. Please try again later.");
            return;
          }
        });
    }
  }
}