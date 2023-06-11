import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Card } from 'src/app/Models/card';
import { Employee } from 'src/app/Models/employee';
import { Gift } from 'src/app/Models/gift';
import { User } from 'src/app/Models/user';
import { UserService } from 'src/app/service/user.service';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-gifts',
  templateUrl: './gifts.component.html',
  styleUrls: ['./gifts.component.scss']
})
export class GiftsComponent implements OnInit {



  //GENERAL VARIABLES

  //This is the variable for the FormGroup.
  form !: FormGroup;

  //This is the variable for associated the User access account. (User or Employee).
  userType: User | Employee | undefined;

  //This is the variable, that indicates if the User is User or Employee, for determinate the div page.
  isEmployee: boolean | undefined;

  //This is a variable, to associate all Http response.
  data: any;



  //VARIABLES FOR EMPLOYEE DASHBOARD

  //Variables to which all the created Gifts are associated.
  allGifts: Gift[] = [];

  //Boolean variables to indicate if the Employee want to see all Gifts created.
  showAllGifts = true;

  //Boolean variables to indicate if the Employee want to create a new Gift
  addNewGift = false;

  //Boolean variables to indicate if the Employee want to check all Users.
  showUsers = false;

  //Variable associated with all registered Users who have redeemed at least 1 Reward
  userFind: any;

  //Boolean variables to indicate if the User has been found.
  isUserFind: Boolean | undefined;

  //Variable to which all the Rewards redeemed by the searched user are associated.
  userFindGift: any;



  //VARIABLES FOR USER

  //Variable associated with all Rewards redeemed by the logged in User.
  allMyGifts: Gift[] = [];

  //Variable to which the User's Card is associated, if one is in possession.
  myCard: Card | undefined | any;

  //Boolean variables to indicate if the User has a Card.
  hasCard = false;

  //Boolean variables to indicate if the User want to see all Rewards.
  showMyReward = false;

  //Booolean variables to indicate if the User wants to see all Rewards.
  showGiftsForUser = false;



  /**
   * Constructor for this Component.
   * @param httpClient the HttpClient object.
   * @param userService the UserService for get the User/Employee logged.
   * @param formBuilder the FormBuilder object for the Forms.
   */
  constructor(
    private httpClient: HttpClient,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) { }

  /**
   * NgOnInit implementation.
   */
  ngOnInit(): void {
    this.initForms();
    this.userType = this.userService.getUser();
    if (this.userType instanceof Employee) {
      this.isEmployee = true;
      this.getAllGifts();
    } else if (this.userType instanceof User) {
      this.isEmployee = false;
      this.getAllGifts();
      this.getMyCard();
      this.getMyGifts();
    }
  }


  //-----EMPLOYEE METHODS------

  /**
   * This method allows you to contact the Backend to return
   * all previously created Rewards.
   */
  getAllGifts() {
    const token = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
    if (this.userType instanceof Employee) {
      this.httpClient.get<any>(`${environment.baseUrl}/gifts/findAllGiftsEmployee`, httpOptions).subscribe(
        response => {
          this.data = response;
          if (this.data.status == 200) {
            this.allGifts = this.data.data;
          }
        }, err => {
          this.data = err;
          if (this.data.status == 500) {
            alert("Something went wrong. Please try again");
          }
        });
    } else if (this.userType instanceof User) {
      this.httpClient.get<any>(`${environment.baseUrl}/gifts/findAllGiftsUser`, httpOptions).subscribe(
        response => {
          this.data = response;
          if (this.data.status == 200) {
            this.allGifts = this.data.data;
          }
        }, err => {
          this.data = err;
          if (this.data.status == 500) {
            alert("Something went wrong. Please try again");
          }
        });
    }
  }

  /**
   * This method allows you to contact the Backend to create
   * a new Reward.
   */
  createGifts() {
    const token = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
    const nomePremio = this.form.value.nome;
    const punti = this.form.value.punti;
    this.httpClient.post(`${environment.baseUrl}/gifts/create`, { nome: nomePremio, punti: punti }, httpOptions).subscribe(
      response => {
        this.data = response;
        if (this.data.status == 201) {
          alert("Premio creato con successo");
          this.closeCreationGifts();
        }
      }, err => {
        this.data = err;
        if (this.data.status == 400) {
          alert("Campi vuoti. Operazione non valida. Riprova.");
          return;
        } else if (this.data.status == 500) {
          alert("Something went wrong. Please try again");
          return;
        }
      });
  }

  closeCreationGifts() {
    this.resetData();
    this.resetForm();
    this.getAllGifts();
    this.addNewGift = false;
    this.showAllGifts = true;
  }

  /**
   * This method allows you to contact the Backend to remove
   * a particupar Reward.
   */
  removeGifts(gifts: Gift) {
    const token = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
    this.httpClient.post<any>(`${environment.baseUrl}/gifts/delete/${gifts.id}`, {}, httpOptions).subscribe(
      response => {
        this.data = response;
        if (this.data.status == 200) {
          alert("Premio rimosso con successo.");
          this.closeRemoveGifts();
        }
      }, err => {
        this.data = err;
        if (this.data.status == 404) {
          alert("Errore nella rimozione. Riprovare.");
          this.closeRemoveGifts();
        } else if (this.data.status == 500) {
          alert("Something went wrong. Please try again");
          this.closeRemoveGifts();
        }
      });
  }

  removeReward(idGift: Number, idUser: Number) {
    if (this.userFind) {
      const token = localStorage.getItem('accessToken');
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + token
        })
      };
      this.httpClient.post<any>(`${environment.baseUrl}/gifts/removeReward`, { idUser: idUser, idGift: idGift }, httpOptions).subscribe(
        response => {
          this.data = response;
          if (this.data.status == 200) {
            alert("Premio rimosso con successo.");
            this.closeRemoveGifts();
          }
        }, err => {
          this.data = err;
          alert("Errore nella rimozione.");
          this.closeCreationGifts();
        }
      );
    }

  }

  closeRemoveGifts() {
    this.resetData();
    this.resetForm();
    this.getAllGifts();
  }

  /**
   * This method allows you to search for a User who has
   * redeemed at least one Reward, through his lastname.
   */
  searchUsers() {
    const cognome = this.form.value.cognome;
    const token = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };

    this.httpClient.post<any>(`${environment.baseUrl}/gifts/findAllReedemByUser`, { cognome: cognome }, httpOptions).subscribe(
      response => {
        this.data = response;
        if (this.data.status == 200) {
          this.userFindGift = this.data.data;
          this.userFind = this.data.datiUtente;
          this.isUserFind = true;
          console.log("User find : " + this.userFindGift + "\nDati utente : " + this.userFind);
          this.resetData();
          this.resetForm();
        } else if (this.data.status == 202) {
          this.isUserFind = true;
          this.userFind = this.data.datiUtente;
          this.userFindGift = null;
        }
      }, err => {
        this.data = err;
        if (this.data.status == 202) {
          this.isUserFind = true;
          this.userFind = this.data.datiUtente;
          this.userFindGift = null;
        } else if (this.data.status == 404) {
          alert("Cliente non trovato.");
          this.resetData();
          this.resetForm();
        }
      });
  }
  closeSearchUsers() {
    this.showUsers = false;
    this.userFindGift = null;
    this.userFind = null;
    this.isUserFind = false;
    this.resetData();
    this.resetForm();
  }

  /**
   * This method allows you to cancel the creation of a
   * new Reward.
   */
  undoCreation() {
    this.resetForm();
    this.addNewGift = false;
  }


  //-----USER METHODS------

  /**
   * This method allows you to take all the redeemed
   * rewards of a given Client.
   */
  getMyGifts() {
    if (this.userType) {
      const token = localStorage.getItem('accessToken');
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + token
        })
      };
      this.httpClient.get<any>(`${environment.baseUrl}/gifts/findAllUser/${this.userType.getId()}`, httpOptions).subscribe(
        response => {
          this.data = response;
          if (this.data.status == 200) {
            this.allMyGifts = this.data.data;
            this.resetData();
            this.resetForm();
          }
        }, err => {
          this.data = err;
          if (this.data.status == 404) {
            alert("Errore. Riprovare.");
          }
        });
    }

  }

  /**
   * This method allows you to take the user's Card
   * if you have one, to show the points.
   */
  getMyCard() {
    if (this.userType) {
      const token = localStorage.getItem('accessToken');
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + token
        })
      };
      this.httpClient.get<any>(`${environment.baseUrl}/card/findCardUser/${this.userType.getId()}`, httpOptions).subscribe(
        response => {
          this.data = response;
          if (this.data.status == 200) {
            this.myCard = this.data.data;
            this.hasCard = true;
          }
        }, err => {
          this.data = err;
          if (this.data.status == 404) {
            this.hasCard = false;
          } else if (this.data.status == 500) {
            alert("Something went wrong. Please try again");
          }
        });
    }
    this.resetData();
    this.resetForm();
  }

  /**
   * This method allows you to redeem a possible reward, if the points are sufficient.
   * @param gifts the Prize to be redeemed.
   */
  retreiveGift(gifts: Gift) {
    for (let gift of this.allGifts) {
      if (gift.id == gifts.id) {
        if (gift.punti > this.myCard.punti) {
          alert(`Numero Punti non sufficenti`);
          this.resetData();
          this.resetForm();
        } else {
          const token = localStorage.getItem('accessToken');
          const httpOptions = {
            headers: new HttpHeaders({
              'Authorization': 'Bearer ' + token
            })
          };
          this.httpClient.post<any>(`${environment.baseUrl}/gifts/addReward`, { idUser: this.userType?.getId(), idGift: gifts.id }, httpOptions).subscribe(
            response => {
              this.data = response;
              if (this.data.status == 200) {
                alert("Premio riscattato con successo. Ricarica la pagina per vederlo.");
                console.log("Card : " + this.myCard.id + "Punti : " + gifts.punti);
                this.removePoints(this.myCard.codice, gifts.punti, httpOptions);
                this.getMyGifts();
                this.getMyCard();
                this.resetData();
                this.resetForm();
              }
            }, err => {
              this.data = err;
              if (this.data.status == 402) {
                alert("Premio già riscattato.");
                this.resetData();
                this.resetForm();
              } else {
                console.log("Something went wrong");
                this.resetData();
                this.resetForm();
              }
            }
          );
        }
      }
    }
  }



  //---------GENERAL METHODS---------

  /**
   * This method allows any points to be removed from a Customer's
   * card when the Customer makes a reward redemption request.
   * @param idCard the Card id of the Customer.
   * @param numberPoints the number of points to be removed.
   */
  removePoints(codice: Number, numberPoints: Number, httpOptions: any) {
    const token = localStorage.getItem('accessToken');
    this.httpClient.post<any>(`${environment.baseUrl}/card/removePoints`, { codice: codice, punti: numberPoints }, httpOptions).subscribe(
      response => {
        this.data = response;
        if (this.data.status == 200) {
          alert(`${numberPoints} punti rimossi.`);
          this.resetData();
          this.resetForm();
        }
      }, err => {
        this.data = err;
        if (this.data.status == 500) {
          alert("Something went wrong. Please try again");
          this.resetData();
          this.resetForm();
        }
      }
    );
  }

  /**
 * Method to initialize all fields of the FormGroup.
 */
  initForms() {
    this.form = this.formBuilder.group({
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      punti: ['', Validators.required],
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
}
