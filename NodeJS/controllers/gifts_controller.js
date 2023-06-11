const db = require("../config/database.js");
const Gifts = require("../models/gifts.js");
const User = require("../models/user.js");


exports.create = (req, res) => {
    const nome = req.body.nome;
    const punti = req.body.punti;

    if (!nome || !punti) {
        res.status(400).send({
            status: 400,
            message: `Filend can't be empty`,
        });
    }

    const gifts = {
        nome: nome,
        punti: punti
    }

    Gifts.create(gifts).then(data => {
        res.status(201).send({
            status: 201,
            message: `Gifts created successfully`
        })
    }).catch(err => {
        res.status(500).send({
            status: 500,
            message: `Error creating gifts`,
        });
    });
}


exports.update = async (req, res) => {
    const id = req.params.id;
    const nome = req.body.nome;
    const punti = req.body.punti;

    if (!nome || !punti) {
        res.status(400).send({
            status: 400,
            message: `Content can't be empty`,
        });
    }

    const reward = Gifts.findByPk(id);

    if (reward) {
        reward.set({
            nome: `${nome}`,
            punti: `${punti}`,
        });
        await reward.save();
        res.status(200).send({
            status: 200,
            message: `Reward updated successfully`,
        });
    } else res.status(500).send({
        status: 500,
        message: `Reward not updated, error.`,
    });
}


exports.delete = (req, res) => {
    const id = req.params.id;

    if (!id) {
        res.status(400).send({
            status: 400,
            message: `Reward not found`,
        });
    }

    Gifts.destroy({
        where: { id: id },
    }).then(num => {
        if (num == 1) {
            res.status(200).send({
                status: 200,
                message: `Gift removed successfully`,
            })
        } else {
            res.status(404).send({
                status: 404,
                message: `Gift not found`,
            })
        }
    }).catch(err => {
        res.status(500).send({
            status: 500,
            message: `Could not delete gift with id=${id}`,
        });
    });
}


exports.find = (req, res) => {
    const id = req.params.id;

    if (!id) {
        res.status(400).send({
            status: 400,
            message: `Content not valid.`,
        });
    }

    Gifts.findByPk(id).then(data => {
        if (data) {
            res.status(200).send({
                status: 200,
                data: data,
            });
        } else {
            res.status(404).send({
                status: 404,
                message: `Cannot find Gift with id=${id}.`
            });
        }
    }).catch(err => {
        res.status(500).send({
            status: 500,
            message: +`Error retrieving Gift with id=${id}.`,
        });
    });
}


exports.findAll = (req, res) => {

    Gifts.findAll().then(data => {
        res.status(200).send({
            status: 200,
            data,
            message: `All Gifts found`,
        });
    }).catch(err => {
        res.status(500).send({
            status: 500,
            message: "Server errror.",
        });
    });
}


exports.findAllUser = async (req, res) => {
    const idUser = req.params.id;

    if (!idUser) {
        res.status(400).send({
            status: 400,
            message: "Content can't be empty",
        });
    }

    const user = await User.findByPk(idUser);

    if (!user) {
        res.status(404).send({
            status: 404,
            message: "User not found",
        });
    }

    const userGifts = await user.getGifts();

    if (userGifts) {
        res.status(200).send({
            status: 200,
            data: userGifts
        });
    } else if (userGifts == null) {
        res.status(202).send({
            status: 202,
            message: "User don't have any Gifts.",
        })
    }
}


exports.findAllUserReedem = async (req, res) => {
    const cognome = req.body.cognome;
    

    if (!cognome) {
        return res.status(400).send({
            status: 400,
            message: "Content can't be empty",
        });
    }

    const user = await User.findOne({where: {cognome: cognome}});

    if (!user || user == null) {
        return res.status(404).send({
            status: 404,
            message: "User not found",
        });
    }

    const userGifts = await user.getGifts();

    if (userGifts) {
        const dati = {id : user.id, nome : user.nome, cognome: user.cognome};
        res.status(200).send({
            status: 200,
            data: userGifts,
            datiUtente : dati
        });
    } else if (userGifts == null) {
        res.status(202).send({
            status: 202,
            message: "User don't have any Gifts.",
        })
    }
}

exports.addReward = async (req, res) => {
    const user = await User.findByPk(req.body.idUser);
    const reward = await Gifts.findByPk(req.body.idGift);

    if (user && reward) {
        const alreadyReedem = await user.hasGifts(reward);

        if (alreadyReedem) {
            res.status(402).send({
                status: 402,
                message: "Reward already reedem.",
            });
            console.log("Premio già riscattato.");
        } else {
            await user.addGifts(reward, { through: { reedemAt: new Date() } });
            res.status(200).send({
                status: 200,
                message: `Reward added successfully`,
            });
            console.log("Premio riscattato.");
        }
    } else {
        res.status(404).send({
            status: 404,
            message: `Reward not found`,
        });
    }
}

exports.removeReward = async (req, res) => {
    const idUser = req.body.idUser;
    const idGift = req.body.idGift;

    console.log("Id Utente : " + idUser + "Id Gift : " + idGift);
    const user = await User.findByPk(idUser);
    const reward = await Gifts.findByPk(idGift);

    if (user != null && reward != null) {
        const alreadyReedem = await user.hasGifts(reward);

        if (!alreadyReedem) {
            res.status(404).send({
                status: 404,
                message: `The User don't have this reward`,
            });
        } else {
            user.removeGifts(reward);
            res.status(200).send({
                status: 200,
                message: `Reward removed successfully`,
            })
        }
    } else {
        res.status(404).send({
            status: 404,
            message: `Reward not found`,
        });
    }
}

