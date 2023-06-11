const { json } = require("body-parser");
const { Sequelize, where } = require("sequelize")
const db = require("../config/database.js");
const Card = require("../models/card");
const User = require("../models/user");


exports.create = (req, res) => {
    const nome = req.body.nome;
    const cognome = req.body.cognome;
    const codice = req.body.codice;

    if (!nome || !cognome) {
        res.status(400).send({
            status: 400,
            message: "Caselle vuote"
        });
        return;
    }

    User.findOne({
        where: { nome: nome, cognome: cognome }
    }).then(user => {
        if (user) {
            Card.findOne({
                where: { idUtente: user.id },
            }).then(result => {
                if (result != null) {
                    res.status(402).send({
                        status: 402,
                        message: "Tessera già esistente"
                    })
                } else {
                    const card = {
                        idUtente: user.id,
                        codice: codice,
                    }
                    Card.create(card).then(data => {
                        res.status(201).send({
                            status: 201,
                            message: "Tessera creata con successo",
                        });
                    }).catch(err => {
                        res.status(500).send({
                            status: 500,
                            message: err.message || "Errore nel tentativo di creare la tessera"
                        })
                    })
                }
            })
        } else {
            res.status(404).send({
                status: 404,
                message: "Cliente non trovato"
            });
        }
    });
}


exports.delete = (req, res) => {
    const id = req.params.id;

    if (!id) {
        res.status(400).send({
            status: 400,
            message: "Id non puo essere vuoto"
        });
    }

    Card.destroy({
        where: { id: id }
    }).then(num => {
        if (num == 1) {
            res.status(200).send({
                status: 200,
                message: "Tessera cancellata"
            });
        } else {
            res.status(404).send({
                status: 404,
                message: `Impossibile cancellare tessera con id=${id}`
            });
        }
    })
        .catch(err => {
            res.status(500).send({
                status: 500,
                message: `Impossibile cancellare tessera con id=${id}`,
            });
        });
}


exports.find = (req, res) => {
    const id = req.params.id;

    if (!id) {
        res.status(400).send({
            status: 400,
            message: "Id non può essere vuoto"
        });
        return;
    }

    Card.findByPk(id).then(data => {
        if (data) {
            res.status(200).send({
                status: 200,
                data: data,
            });
        } else {
            res.status(404).send({
                status: 404,
                message: `Impossibile trovare tessera con id=${id}.`
            });
        }
    }).catch(err => {
        res.status(500).send({
            status: 500,
            message: `Errore nel recuperare la tessera con id=${id}`,
        });
    });
}


exports.findCardUser = async (req, res) => {
    const idUtente = req.params.id;

    if (!idUtente) {
        res.status(400).send({
            status: 400,
            message: "Casella vuota"
        })
    }

    Card.findOne({ where: { idUtente: idUtente } }).then(
        data => {
            if (data) {
                res.status(200).send({
                    status: 200,
                    data,
                    message: "Tessera recuperata",
                })
            } else {
                res.status(404).send({
                    status: 404,
                    message: `Tu non hai una tessera`
                });
            }
        }).catch(err => {
            res.status(500).send({
                status: 500,
                message: err.message || "Some error occurred while retrieving tutorials."
            });
        });
}


exports.findAll = (req, res) => {
    Card.findAll({
        include: [{
            model: User,
            as: 'owner',
            attributes: ['id', 'nome', 'cognome'],
        }]
    }).then(data => {
        if (data) {
            res.status(200).send({
                status: 200,
                data,
                message: "Tessere recuperate",
            })
        } else {
            res.status(404).send({
                status: 404,
                message: `Impossibile trovare tessere`
            });
        }
    }).catch(err => {
        res.status(500).send({
            status: 500,
            message: err.message || "Some error occurred while retrieving tutorials."
        });
    });
}


exports.addPoints = async (req, res) => {
    const codice = req.body.codice;
    const punti = parseInt(req.body.punti);

    if (!codice || !punti) {
        res.status(400).send({
            status: 400,
            message: "casella vuota"
        });
    }

    const card = await Card.findOne({ where: { codice: codice } });

    if (card) {
        const puntiAttuali = parseInt(card.punti); 
        const updated = puntiAttuali + punti; 
        console.log(updated);
        card.set({ punti: updated });
        await card.save();

        res.status(200).send({
            status: 200,
            message: "Punti aggiunti"
        });
    } else {
        res.status(500).send({
            status: 500,
            message: "Errore nel recuperare la tessera"
        });
    }
}


exports.addPointsAll = async (req, res) => {
    const punti = req.body.punti;

    if (!punti) {
        res.status(400).send({
            status: 400,
            message: "Numero di punti non puo essere nullo"
        });
    }

    await Card.update({ punti: Sequelize.literal(`punti + ${punti}`) }, { where: {} });

    res.status(200).send({
        status: 200,
        message: "Punti aggiunti in tutte le tessere",
    });
}


exports.removePoints = async (req, res) => {
    const codice = req.body.codice;
    const punti = parseInt(req.body.punti);

    if (!codice || !punti) {
        res.status(400).send({
            status: 400,
            message: "Casella vuota"
        });
    }

    const card = await Card.findOne({ where: { codice: codice } });

    if (card) {
        const puntiAttuali = parseInt(card.punti); 
        const updated = puntiAttuali - punti; 
        console.log(updated);
        card.set({ punti: updated });
        await card.save();

        res.status(200).send({
            status: 200,
            message: "Punti rimossi"
        });
    } else {
        res.status(500).send({
            status: 500,
            message: "Errore nel recuperare la tessera"
        });
    }
}


exports.removePointsAll = async (req, res) => {
    const punti = req.body.punti;

    if (!punti) {
        res.status(400).send({
            status: 400,
            message: "Numero di punti nullo"
        });
        return;
    }

    await Card.update({ punti: Sequelize.literal(`punti - ${punti}`) }, { where: {} });

    res.status(200).send({
        status: 200,
        message: "Punti rimossi in tutte le tessere",
    });
}
