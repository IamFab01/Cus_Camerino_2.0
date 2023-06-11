const db = require("../config/database.js");
const Product = require("../models/product");


//Create and Save a new Product : 
exports.create = (req, res) => {
  const nome = req.body.nome;
  const marchio = req.body.marchio;
  const prezzo = req.body.prezzo;
  const immagine = req.body.immagine;


  //Validate request 
  if (!req.body.nome) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  //Create a booking
  const product = {
    nome: nome,
    marchio: marchio,
    prezzo: prezzo,
    immagine: immagine
  };

  //Save booking in the database
  Product.create(product).then(
    data => {
      res.send(data);
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the new Product."
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Product.destroy({
    where: { id: id }
  }).then(num => {
    if (num == 1) {
      res.send({
        message: "Product was deleted successfully"
      });
    } else {
      res.send({
        message: `Cannot delete Product with id=${id}. Maybe Product was not found!`
      });
    }
  }).catch(err => {
    res.status(500).send({
      message: " Could not delete Product with id : " + id
    });
  });
};

exports.deleteAll = (req, res) => {
  Product.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({
        message: `${nums} Product were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all products."
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  const name = req.body.nome;
  const marchio = req.body.marchio;
  const prezzo = req.body.prezzo;
  const immagine = req.body.immagine;

  Product.update({
    nome: name,
    marchio: marchio,
    prezzo: prezzo,
    immagine: immagine
  }, {
    where: { id: id }
  }).then(num => {
    if (num == 1) {
      res.send({
        message: "Product was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update Product with id=${id}. Maybe Product was not found or req.body is empty!`
      });
    }
  })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Product with id=" + id
      });
    });;

};

exports.findAll = (req, res) => {
  Product.findAll({ where: {} })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving products."
      });
    });
};

exports.find = (req, res) => {
  const id = req.params.id;

  Product.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Product with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Product with id=" + id
      });
    });
};
