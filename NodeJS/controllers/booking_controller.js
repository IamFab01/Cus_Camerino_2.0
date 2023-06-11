const db = require("../config/database.js");
const Booking = require("../models/booking");
const User = require("../models/user.js");



exports.create = (req, res) => {
  const nome = req.body.nome;
  const cognome = req.body.cognome;
  const dataPrenotazione = req.body.dataPrenotazione;
  const oraInizio = req.body.oraInizio;
  const oraFine = req.body.oraFine;
  const completata = req.body.completata;


  if (!nome || !cognome) {
    res.status(400).send({
      status: 400,
      message: "Inserisci nome e cognome"
    });
    return;
  }

  const booking = {
    nome: nome,
    cognome: cognome,
    dataPrenotazione: dataPrenotazione,
    oraInizio: oraInizio,
    oraFine: oraFine,
    completata: completata
  }
  Booking.create(booking).then(data => {
    res.status(201).send({
      status: 201,
      message: "Prenotazione registrata"
    });
  }).catch(err => {
    res.status(500).send({
      message:
        err.message || "Errore nel tentativo di creare una prenotazione"
    })
  })
}


exports.delete = (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).send({
      status: 400,
      message: "Content can't be empty!",
    })
  }

  Booking.destroy({
    where: { id: id }
  }).then(num => {
    if (num == 1) {
      res.status(200).send({
        status: 200,
        message: "Prenotazione cancellata"
      });
    } else {
      res.status(404).send({
        status: 404,
        message: `Impossibile cancellare prenotazione con id=${id}.`
      });
    }
  }).catch(err => {
    res.status(500).send({
      status: 500,
      message: " Impossibile cancellare prenotazione con id : " + id
    });
  });
};


exports.deleteAll = (req, res) => {
  Booking.destroy({
    where: {},
    truncate: false
  }).then(nums => {
    res.status(200).send({
      status: 200,
      message: `${nums} Prenotazioni cancellate`
    });
  })
    .catch(err => {
      res.status(500).send({
        status: 500,
        message: err.message || "Errore nel tentativo di rimuovere le prenotazioni."
      });
    });
};


exports.update = async (req, res) => {
  const id = req.params.id;
  const completata = req.body.completata;


  if (completata == null || completata == "" || !id) {
    res.status(400).send({
      status: 400,
      message: "Compila la/le caselle di testo"
    });
    return;
  }

  const booking = await Booking.findByPk(id);

  if (booking) {
    booking.completata = completata;

    await booking.save();

    res.status(200).send({
      status: 200,
      message: "Prenotazione aggiornata"
    })
  } else {
    res.status(500).send({
      status: 500,
      message: `Impossibile aggiornare la prenotazione con id=${id}.`
    });
  };
}


exports.findAll = (req, res) => {
  Booking.findAll({
    where : {}
  }).then(data => {
    if (data) {
      res.status(200).send({
        status: 200,
        data: data,
        message: "Lista delle prenotazioni recuperata con successo."
      })
    } else {
      res.status(404).send({
        status: 404,
        message: `Impossibile trovare le prenotazioni`
      });
    }
  }).catch(err => {
    res.status(500).send({
      status: 500,
      message: err.message || "Errore nel tentativo di trovare le prenotazioni"
    });
  });
};


exports.findOne = (req, res) => {
  const nome = req.query.nome;
  const cognome = req.query.cognome;

  if (!nome || !cognome) {
    res.status(400).send({
      status: 400,
      message: "Le caselle di testo vanno compilate tutte",
    })
  }

  Booking.findAll({ where: { nome: nome, cognome: cognome } })
    .then(data => {
      if (data) {
        res.status(200).send({
          status: 200,
          data: data,
          message: "Prenotazione recuperata"
        })
      } else {
        res.status(404).send({
          status: 404,
          message: `Impossibile trovare la prenotazione con nome=${nome} e cognome=${cognome}.`
        });
      }
    }).catch(err => {
      res.status(500).send({
        status: 500,
        message: err.message || "Errore nel tentativo di recuperare le prenotazioni"
      });
    });
}



exports.findFreeBooking = (req, res) => {
  Booking.findAll({ where: { completata: false } })
    .then(data => {
      res.status(200).send({
        status: 200,
        data: data
      });
    }).catch(err => {
      res.status(500).send({
        status: 500,
        message: "Error retrieving bookings."
      });
    });
}

exports.find = (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).send({
      status: 400,
      message: "Caselle non possono essere vuote",
    })
  }

  Booking.findByPk(id)
    .then(data => {
      if (data) {
        res.status(200).send({
          status: 200,
          data: data,
        });
      } else {
        res.status(404).send({
          status: 404,
          message: `Impossibile trovare prenotazione con id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        status: 500,
        message: "Errore nel recuperare la prenotazione con id: " + id
      });
    });
};

exports.findAllCompleted = (req, res) => {
  Booking.findAll({ where: { completata: true } })
    .then(data => {
      res.status(200).send({
        status: 200,
        data: data,
      });
    }).catch(err => {
      res.status(500).send({
        status: 500,
        message: err.message || "Errore nel recuperare le prenotazioni"
      });
    });
};





