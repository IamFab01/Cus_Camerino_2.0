import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Booking } from 'src/app/Models/booking';
import { Employee } from 'src/app/Models/employee';
import { User } from 'src/app/Models/user';
import { UserService } from 'src/app/service/user.service';
import { environment } from 'src/environments/environments';
import { CalendarOptions, DateSelectArg } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';



@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent {

  //---GENERAL VARIABLES----

  //This is the variable for the FormGroup.
  public form !: FormGroup;

  //This is the variable for associated the User access account. (User or Employee).
  userType: User | Employee | undefined;

  //This is the variable, that indicates if the User is User or Employee, for determinate the div page.
  isVisible = false;

  //This is a variable, to associate all Http response.
  data: any;


  //---VARIABLES FOR EMPLOYEE----

  //Variables that rapresent all Bookings.
  bookings: Booking[] = [];

  //Variables that rapresent all today Bookings
  bookingsToday: Booking[] = [];

  open = false;

  searchedBooking = false;


  //-----VARIABLES FOR USER-----

  //Variable that rapresent the User Bookings.
  bookingsUser: Booking[] = [];

  openList = false;

  searchedBookingsUser: Booking[] = [];

  showFormSearchBookingUser = false;

  showFormAddBookingUser = false;


  //----VARIABLES FOR CALENDAR----

  //This is the variable that indicates if the calendar is visible or not.
  calendarVisible = true;

  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    timeZone: 'Europe/Rome',
    events: [],
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.showAlertToAdd.bind(this)
  };


  /**
      * Constructor for this Component.
      * @param httpClient the HttpClient object.
      * @param authUser the UserService for get the User/Employee logged.
      * @param formBuilder the FormBuilder object for the Forms.
      */
  constructor(
    private httpClient: HttpClient,
    private authUser: UserService,
    private formBuilder: FormBuilder
  ) { }


  //NgOnInit implementation
  ngOnInit() {
    this.initForm();
    this.userType = this.authUser.getUser();
    if (this.userType instanceof Employee) {
      this.isVisible = true;
      this.getAllBookings();
    } else if (this.userType instanceof User) {
      this.isVisible = false;
      this.getBookingUser();
    }
  }

  //This is the method for init the FormGroup.
  initForm() {
    this.form = this.formBuilder.group({
      dataPrenotazione: ['dd-MM-yyyy', Validators.required],
      oraPrenotazione: ['', Validators.required],
      nome: ['', Validators.required],
      cognome: ['', Validators.required]
    });
  }



  //-----EMPLOYEE METHODS------


  //This method returns all bookings
  getAllBookings() {
    const token = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
    this.httpClient.get<any>(`${environment.baseUrl}/booking/findAll`, httpOptions).subscribe(response => {
      this.data = response;
      if (this.data.status === 200) {
        this.bookings = this.data.data;
        this.stampData();
      }
      else if (this.data.status === 404) {
        alert("Errore nella ricerca delle prenotazioni.");
      } else {
        alert("Errore.");
      }
    }, err => {
      alert("Something went wrong");

    });
    this.resetData();
  }

  //This method print booking in the calendar
  private stampData() {
    let events: any[] = [];
    for (let i = 0; i < this.bookings.length; i++) {
      const booking = this.bookings[i];
      const date = new Date(booking.dataPrenotazione).toISOString().replace(/T.*$/, '');
      if (this.userType instanceof User) {
        if (booking.nome === this.userType?.nome && booking.cognome === this.userType?.cognome) {
          events.push({
            start: date + 'T' + booking.oraInizio,
            end: date + 'T' + booking.oraFine,
            color: 'green'
          });
        } else {
          events.push({
            title: "Prenotazione",
            start: date + 'T' + booking.oraInizio,
            end: date + 'T' + booking.oraFine,
            color: 'red'
          });
        }
      } else {
        events.push({
          start: date + 'T' + booking.oraInizio,
          end: date + 'T' + booking.oraFine,
          color: this.getRandomColor()
        });
      }
    }
    this.calendarOptions.events = events;
  }


  private getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  //This method returns all bookings of the day
  getAllBookingsToday() {
    this.openList = true;
    this.bookingsToday = [];
    const dataCorrente = new Date();
    for (const booking of this.bookings) {
      const dataPrenotazione = new Date(booking.dataPrenotazione);
      if (dataPrenotazione.getDate() === dataCorrente.getDate() &&
        dataPrenotazione.getMonth() === dataCorrente.getMonth() &&
        dataPrenotazione.getFullYear() === dataCorrente.getFullYear()) {
        this.bookingsToday.push(booking);
      }
    }
  }


  //This method set complete booking
  setCompletata(booking: Booking) {
    const token = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
    if (booking.completata === 0) {
      this.httpClient.post(`${environment.baseUrl}/booking/update/${booking.id}`, { completata: 1 }, httpOptions).subscribe(
        response => {
          this.data = response;

        }, err => {
          alert("Something went wrong");
        });
    } else {
      alert("Prenotazione già completata");
    }
  }

  //This method allows you to search a Bookings of a specific user
  searchBookingsUser() {
    const nome = this.form.value.nome;
    const cognome = this.form.value.cognome;
    let clienteTrovato = false;
    for (let booking of this.bookings) {
      if (booking.nome === nome && booking.cognome === cognome) {
        this.searchedBookingsUser.push(booking);
        this.searchedBooking = true;
        this.showFormSearchBookingUser = false;
        clienteTrovato = true;
      }
    }
    if (!clienteTrovato) {
      alert("Cliente non trovato, riprova.");
    }
    this.resetForm();
  }

  removeBookingEmp(booking: Booking) {
    const token = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
    this.httpClient.delete(`${environment.baseUrl}/booking/delete/${booking.id}`, httpOptions).subscribe(response => {
      this.data = response;
      if (this.data.status === 200) {
        alert("Prenotazione rimossa con successo.");
        if (this.userType instanceof Employee) {
          const index = this.bookingsToday.indexOf(booking);
          this.bookingsToday.splice(index, 1);
          const index1 = this.searchedBookingsUser.indexOf(booking);
          this.searchedBookingsUser.splice(index1, 1);
          this.getAllBookings();
        }
      } else if (this.data.status === 404) {
        alert("Prenotazione non trovata riprovare.");
      } else {
        alert("Errore nella rimozione.");
      }
    }, err => {
      alert("Something went wrong.");
    });
    this.resetData();
  }




  //-----USER METHODS-------

  //This method returns all bookings of a user
  getBookingUser() {
    const token = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
    if (this.userType instanceof User) {
      const params = new HttpParams()
        .set('nome', this.userType.nome)
        .set('cognome', this.userType.cognome);
        const options = {
          params: params,
          headers: httpOptions.headers
      };
      this.httpClient.get<any>(`${environment.baseUrl}/booking/findAllUser`, options).subscribe(
        response => {
          this.data = response;
          if (this.data.status === 200) {
            this.bookingsUser = this.data.data;
            this.stampData();
          } else if (this.data.status === 404) {
            alert("Prenotazioni non trovate");
          } else {
            alert("Errore");
          }
        }, err => {
          alert("Something went wrong");
        });
    }
    this.resetData();
  }


  showCalendar() {
    this.getAllBookings();
    this.open = true;
  }



  //This method allows user to search a Bookings
  searchBookings() {
    const dataPrenotazione = new Date(this.form.value.dataPrenotazione);
    let prenotazioneTrovata = false;
    for (let booking of this.bookingsUser) {
      const bookingDate = new Date(booking.dataPrenotazione);
      if (bookingDate.getTime() === dataPrenotazione.getTime()) {
        this.searchedBookingsUser.push(booking);
        alert("Prenotazione trovata con successo.");
        this.searchedBooking = true;
        prenotazioneTrovata = true;
        this.showFormSearchBookingUser = false;
      }
    }
    if (!prenotazioneTrovata) {
      alert("Prenotazione non trovata. Riprovare.");
    }
    this.resetForm();
  }

  removeBookingUser(booking: Booking) {
    const token = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
    this.httpClient.delete(`${environment.baseUrl}/booking/delete/${booking.id}`, httpOptions).subscribe(response => {
      this.data = response;
      if (this.data.status === 200) {
        alert("Prenotazione rimossa con successo.");
        if (this.userType instanceof User) {
          const index = this.searchedBookingsUser.indexOf(booking);
          this.searchedBookingsUser.splice(index, 1);
          this.getBookingUser();
        }
      } else if (this.data.status === 404) {
        alert("Prenotazione non trovata riprovare.");
      } else {
        alert("Errore nella rimozione.");
      }
    }, err => {
      alert("Something went wrong.");
    });
    this.resetData();
  }




  //-----OTHER METHODS----------

  //This is the method for reset the FormGroup value.
  resetForm() {
    this.form.reset();
  }


  //This is the method for reset the Data from backend.
  resetData() {
    this.data = null;
  }


  //This method close the Search Booking.
  closeSearchedBookingsUser() {
    if (this.userType instanceof User) {
      this.getBookingUser();
    }
    this.searchedBooking = false;
    this.searchedBookingsUser = [];
    this.showFormSearchBookingUser = false;
  }

  completata(booking: Booking) {
    if (booking.completata === 0)
      return "No"
    else
      return "Si'"
  }


  close() {
    this.openList = false;
    this.bookingsToday = [];
  }




  //-----CALENDAR METHODS----------

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }


  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  showAlertToAdd(selectInfo: DateSelectArg) {
    const nome = prompt('Inserisci il nome del cliente');
    const cognome = prompt('Inserisci il cognome del cliente');

    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); //  clear date selection

    if (nome && cognome) {
      if (this.userType instanceof User) {
        if (nome != this.userType.nome || cognome != this.userType.cognome) {
          alert("Nome e cognome errati. Riprovare.");
        } else {
          this.addBooking(selectInfo, nome, cognome);
        }
      } else if (this.userType instanceof Employee) {
        this.addBooking(selectInfo, nome, cognome);
      }
    }
  }

  addBooking(selectInfo: DateSelectArg, nome: string, cognome: string) {
    const token = localStorage.getItem('accessToken'); //recupero token di accesso
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token   //assicuro che la richiesta sia autenticata correttamente
      })
    };
      this.httpClient.put(`${environment.baseUrl}/booking/create`, {
        nome: nome, cognome: cognome, dataPrenotazione: selectInfo.view.activeStart, oraInizio: selectInfo.startStr,
      oraFine: selectInfo.endStr, completata: 0
      }, httpOptions).subscribe({
        next: (response: any) => {
          // Callback per la risposta successo
          this.data = response;
          if (this.data.status === 201) {
            alert("Prenotazione aggiunta con successo.");
            if (this.userType instanceof User) {
              this.getBookingUser();
              this.getAllBookings();
            } else if (this.userType instanceof Employee) {
              this.getAllBookings();
            }
            //Callback per errore
          } else if (this.data.status === 404) {
            alert("Utente non trovato.");
          } else {
            alert("Errore nella creazione.");
          }
        },
        error: (err: any) => {
          alert("Funzione al momento non disponibile");
        }
      });
  }
}

