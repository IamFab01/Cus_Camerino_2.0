const db = require("../config/database.js");
const bcrypt = require('bcrypt');
const Employee = require("../models/employee");
const passManager = require("../utils/passController");
const auth = require("../auth/jwtController");
//Secret for Authentication:
const secret = "!Rj(98bC%9sVn&^c";


exports.create = async (req, res) => {

    if (req.body.nameEmployee == "" || req.body.nameEmployee == undefined || req.body.code == "" || req.body.code == undefined || req.body.passwordEmployee == "" || req.body.passwordEmployee == undefined) {
        res.status(400).send({
            status: 400,
            message: "Caselle di testo vuote"
        });
        return;
    }
    const password = req.body.passwordEmployee + secret;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const employee = {
        nome: req.body.nameEmployee,
        codice: req.body.code,
        salt: salt,
        password: hashedPassword,
        restrizioni: req.body.restrizioni
    };
    console.log("Employee : " + req.body.nameEmployee + " Codice : " + req.body.code + " Salt : " + salt + " Password : " + hashedPassword + "Restrizioni : " + req.body.restrizioni);

    Employee.create(employee).then(result => {
        if (result) {
            return res.status(201).send({
                status: 201,
                message: `Dipendente creato con ${req.body.restrizioni} restrizioni`
            });
        }
    }).catch(error => {
        res.status(500).send({
            status: 500,
            message: error.message || "Errore nel creare il dipendente"
        })
    });
}


exports.login = async (req, res) => {
    if (req.body.codice == "" || req.body.codice == undefined || req.body.password == "" || req.body.password == undefined) {
        res.status(400).send({
            message: "Caselle vuote"
        });
        return;
    }

    let codice = req.body.codice;
    let password = req.body.password;

    password = password + secret;


    Employee.findOne({
        where: {
            codice,
        },
    }).then((employee) => {
        if (!employee) {
            return res.status(404).send({
                status: 404,
                message: "DIpendente con questo codice non trovato",
            });
        }

        return passManager.comparePass(password, employee.password)
            .then((isMatch) => {
                if (!isMatch) {
                    console.log("Password not valid");
                    return res.status(400).send({
                        status: 400,
                        message: "Password non corretta",
                    });
                } else {
                    const accessToken = auth.getAccessTokenEmployee(employee);
                    const refreshToken = auth.getRegfreshTokenEmployee(employee);
                    auth.addRefreshToken(refreshToken);
                    const jsonResponse = { id: employee.id, nome: employee.nome, codice: employee.codice, restrizioni: employee.restrizioni }
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
};


exports.logout = async (req, res) => {
    let refreshToken = req.body.refreshToken;

    //Validate the refresh token
    if (!refreshToken) {
        res.status(400).send({
            status: 400,
            message: "Token non presente.",
        });
    }

    let index = auth.refreshTokens.indexOf(refreshToken);

    if (index == -1) {
        return res.status(404).send({
            status: 404,
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
        return res.status(404).send({
            status: 404,
            message: "Tu non sei autenticato",
        });
    }

    let employee = auth.getEmployeeByRefreshToken(refreshToken);

    auth.refreshTokens = auth.refreshTokens.filter((token) => token != refreshToken);

    let newAccessToken = auth.getAccessTokenEmployee(employee);
    let newRefreshToken = auth.getRegfreshTokenEmployee(employee);
    auth.refreshTokens.push(newRefreshToken);
    console.log(auth.refreshTokens)

    return res.status(200).send({
        status: 200,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    });
}


//-----OTHER METHODS-----

exports.delete = (req, res) => {
    const id = req.params.id;

    if (!id) {
        res.status(400).send({
            message: "Id non puo essere vuoto"
        });
        return;
    }

    Employee.destroy({ where: { id: id } }).then(num => {
        if (num == 1) {
            res.status(200).send({
                status: 200,
                message: "DIpendente rimosso"
            });
        } else {
            res.status(404).send({
                status: 404,
                message: `Impossibile rimuovere dipendente con id=${id}`
            });
        }
    }).catch(err => {
        res.status(500).send({
            status: 500,
            message: `Impossibile rimuovere dipendente con id=${id}.`
        });
    });
}


exports.update = async (req, res) => {
    const id = req.params.id;
    const oldPassword = req.body.oldPassword + secret;
    const newPassword = req.body.newPassword + secret;

    if (!req.params.id || !req.body.newPassword) {
        res.status(400).send({
            status: 400,
            message: "Non puo essere vuoto"
        });
        return;
    }

    const employee = await Employee.findByPk(id);

    if (employee) {
        if (oldPassword != null && oldPassword != undefined) {
            const saltEmployee = employee.salt;
            const hashPassword = await bcrypt.hash(newPassword, saltEmployee);
            return passManager.comparePass(oldPassword, employee.password)
                .then((isMatch) => {
                    console.log("Old : " + oldPassword + "Real : " + employee.password);

                    if (!isMatch) {
                        return res.status(404).send({
                            status: 404,
                            message: "Password non corretta",
                        });
                    } else {
                        employee.set({
                            password: `${hashPassword}`
                        });
                        employee.save();
                        res.status(200).send({
                            status: 200,
                            message: "Dati del dipendente aggiornati"
                        });
                    }
                }, err => {
                    res.status(500).send({
                        status: 500,
                        message: err.message || "Errore nell'aggiornari i dati del dipendente"
                    });
                });
        }
    }
}


exports.find = (req, res) => {
    const id = req.params.id;

    if (!id) {
        res.status(400).send({
            status: 400,
            message: "Non puo essere vuoto"
        });
        return;
    }

    Employee.findByPk(id).then(data => {
        if (data) {
            res.status(200).send({
                status: 200,
                data: data,
            });
        } else {
            res.status(404).send({
                status: 404,
                message: `Impossibile trovare il dipendente con id=${id}.`
            });
        }
    }).catch(err => {
        res.status(500).send({
            status: 500,
            message: `Impossibile recuperare dipendente con id=${id}.`
        });
    });
}


exports.findAll = (req, res) => {
    Employee.findAll({
        attributes: ['id', 'nome', 'codice', 'restrizioni']
    }).then(data => {
        if (data) {
            res.status(200).send({
                status: 200,
                data: data,
            });
        } else {
            res.status(404).send({
                status: 404,
                message: `Impossibile trovare il dipendente`
            });
        }
    }).catch(err => {
        res.status(500).send({
            status: 500,
            message: err.message || "Some error occurred while retrieving tutorials."
        });
    });
}