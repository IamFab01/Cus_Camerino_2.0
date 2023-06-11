const db = require("../config/database.js");
const bcrypt = require('bcrypt');
const User = require("../models/user");
const passManager = require("../utils/passController.js");
const auth = require("../auth/jwtController");

const secret = "!Rj(98bC%9sVn&^c";


exports.create = async (req, res) => {

  if (req.body.email == "" || req.body.email == undefined || req.body.password == "" || req.body.password == undefined) {
    res.status(400).send({
      status: 400,
      message: "Casella non puo essere vuota"
    });
    return;
  }

  const email = req.body.email;
  const password = req.body.password + secret;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log("User : " + email + "Salt : " + salt + "Password : " + hashedPassword);

  const user = {
    nome: req.body.nome,
    cognome: req.body.cognome,
    email: email,
    salt: salt,
    password: hashedPassword
  };

  User.create(user).then(data => {
    res.status(201).send({
      status: 201,
      message: "Utente creato con successo",
    });
  }).catch(err => {
    res.status(500).send({
      status: 500,
      message: err.message || "Errore nel creare l'utente"
    });
  });
}


exports.login = async (req, res) => {

  if (req.body.email == "" || req.body.email == undefined || req.body.password == "" || req.body.password == undefined) {
    res.status(400).send({
      message: "Casella non puo essere vuota"
    });
    return;
  }

  let email = req.body.email;
  let password = req.body.password;

  password = password + secret;

  User.findOne({
    where: {
      email: email
    },
  }).then((user) => {
    if (!user) {
      return res.status(404).send({
        status: 404,
        message: "Utente con questa email non trovata",
      });
    }

    return passManager.comparePass(password, user.password)
      .then((isMatch) => {
        if (!isMatch) {
          console.log("Password non valida");
          return res.status(400).send({
            status: 400,
            message: "Password non corretta",
          });
        } else {
          const accessToken = auth.getAccessTokenUser(user);
          const refreshToken = auth.getRegfreshTokenUser(user);
          auth.addRefreshToken(refreshToken);
          const jsonResponse = { id: user.id, nome: user.nome, cognome: user.cognome, email: user.email };
          res.status(200).send({
            status: 200,
            jsonResponse,
            accessToken: accessToken,
            refreshToken: refreshToken,
            message: "Login effettuato",
          });
        }
      });
  });
}


exports.logout = async (req, res) => {
  let refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    res.status(400).send({
      status: 400,
      message: "Casella non puo essere vuota"
    });
    return;
  }

  let index = auth.refreshTokens.indexOf(refreshToken);

  if (index == -1) {
    res.status(401).send({
      status: 401,
      message: "Non sei autenticato",
    });
  }

  auth.refreshTokens.splice(index, 1);
  console.log(auth.refreshTokens);

  res.status(200).send({
    status: 200,
    message: "Logout effettuato",
  });
}

exports.refreshToken = async (req, res) => {
  let refreshToken = req.body.refreshToken;

  if (!refreshToken || !auth.containsToken(refreshToken)) {
    return res.status(401).send({
      status: 401,
      message: "Tu non sei autenticato",
    });
  }

  let user = auth.getUserByRefreshToken(refreshToken);

  auth.refreshTokens = auth.refreshTokens.filter(token => token !== refreshToken);

  let newAccessToken = auth.getAccessTokenUser(user);
  let newRefreshToken = auth.getRegfreshTokenUser(user);
  auth.refreshTokens.push(newRefreshToken);
  console.log("Nuovi Token : " + "\nAccessToken : " + newAccessToken + "\nRefreshToken : " + newRefreshToken);
  console.log(auth.refreshTokens);

  return res.status(200).send({
    status: 200,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
}


//altri metodi

exports.delete = (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).send({
      status: 400,
      message: "Id non puo essere vuoto"
    });
    return;
  }

  User.destroy({
    where: { id: id }
  }).then(num => {
    if (num == 1) {
      res.status(200).send({
        status: 200,
        message: "Utente rimosso"
      });
    } else {
      res.status(404).send({
        status: 404,
        message: `Impossibile rimuovere utente con id=${id}`
      });
    }
  }).catch(err => {
    res.status(500).send({
      status: 500,
      message: `Non puoi rimuovere utente con id=${id}.`
    });
  });
};

exports.updateEmail = async (req, res) => {
  const id = req.params.id;
  const email = req.body.email;

  if (!id || !email) {
    return res.status(400).send({
      status: 400,
      message: "Casella non puo essere vuota"
    })
  }

  const user = await User.findByPk(id);

  if (user) {
    user.set({
      email: `${email}`
    });
    await user.save();
    return res.status(200).send({
      status: 200,
      message: "Email aggiornata"
    });
  } else {
    return res.status(404).send({
      status: 404,
      message: `Non si puo aggiornare utente con id=${id}`
    });
  }
}

exports.updatePassword = async (req, res) => {
  const id = req.params.id;
  const oldPassword = req.body.oldPassword + secret;
  const newPassword = req.body.newPassword + secret;

  if (!id || !oldPassword || !newPassword) {
    return res.status(400).send({
      status: 400,
      message: "Casella non puo essere vuota"
    });
  }

  const user = await User.findByPk(id);

  if (user) {
    if (oldPassword != null && oldPassword != undefined) {
      const saltUser = user.salt;
      const hashPassword = await bcrypt.hash(newPassword, saltUser);
      console.log("New Password : " + hashPassword);

      return passManager.comparePass(oldPassword, user.password)
        .then((isMatch) => {
          console.log("Old : " + oldPassword + "Real : " + user.password);
          if (!isMatch) {
            return res.status(404).send({
              status: 404,
              message: "Password non corretta",
            });
          } else {
            user.set({
              password: `${hashPassword}`
            });
            user.save();
            return res.status(200).send({
              status: 200,
              message: "Password aggiornata"
            });
          }
        }, err => {
          return res.status(500).send({
            status: 500,
            message: err.message || "Errore nell'aggiornare dati dell'utente"
          });
        })
    }
  }
}


exports.find = (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).send({
      status: 400,
      message: "Id non puo essere vuoto"
    });
    return;
  }

  User.findByPk(id).then(data => {
    if (data) {
      res.status(200).send({
        status: 200,
        data: data,
      });
    } else {
      res.status(404).send({
        status: 404,
        message: `Impossibile trovare utente con id=${id}.`
      });
    }
  }).catch(err => {
    res.status(500).send({
      status: 500,
      message: `Errore nel recuperare utente con id=${id}.`
    });
  });
}


exports.findAll = (req, res) => {
  User.findAll({
    attributes: ['id', 'nome', 'cognome', 'email']
  }).then(data => {
    res.status(200).send({
      status: 200,
      data: data,
      message: "Utente recuperato"
    });
  }).catch(err => {
    res.status(500).send({
      status: 500,
      message: err.message || "Errore nel recuperare l'utente"
    });
  });
};

