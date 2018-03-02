const UserModel = require('../models/user.model');

module.exports = {
    add: (data) => {
        return new Promise((accept, reject) => {
            if(!data.username && !data.password && !data.security) {
                reject({
                    "status": 0,
                    "message": "Missing required variables."
                });
            }
            bcrypt.hash(data.password, 10, (err, passwordHash) => {
                if(err) {
                    reject({
                        "status": 0,
                        "message": err
                    });
                }
                user.username = data.username;
                user.password = passwordHash;
                user.security = security;
                user.save((err) => {
                    if(err) {
                        reject({
                            "status": 0,
                            "message": err
                        });
                    } else {
                        accept({
                            "status": 1,
                            "message": ""
                        });
                    }
                });
            });
        });
    },
    get: (id) => {
        return new Promise((accept, reject) => {
            UserModel.findById(id, (err, result) => {
                if(err) {
                    reject({
                        "status": 0,
                        "message": err
                    });
                } else {
                    accept({
                        "status": 1,
                        "message": result
                    });
                }
            });
        });
    },
    list: () => {
        return new Promise((accept, reject) => {
            let query = UserModel.find();
            query.exec((err, result) => {
                if(err) {
                    reject({
                        "status": 0,
                        "message": err
                    });
                } else {
                    accept({
                        "status": 1,
                        "message": result
                    });
                }
            });
        });
    },
    update: (id, data) => {
        return new Promise((accept, reject) => {
            if(!data.password && !data.security) {
                reject({
                    "status": 0,
                    "message": "Missing required variables."
                });
            }
            UserModel.findById(id, (err, result) => {
                if(err) {
                    reject({
                        "status": 0,
                        "message": err
                    });
                } else {
                    // Don't use .set(...), we don't want to change their username.
                    result.password = data.password;
                    result.security = data.security;
                    result.save((err) => {
                        if(err) {
                            reject({
                                "status": 0,
                                "message": err
                            });
                        } else {
                            accept({
                                "status": 1,
                                "message": result
                            });
                        }
                    });
                }
            });
        });
    },
    delete: (id) => {
        return new Promise((accept, reject) => {
            UserModel.remove({_id: id}, (err, result) => {
                if(err) {
                    reject({
                        "status": 0,
                        "message": err
                    });
                } else {
                    accept({
                        "status": 1,
                        "message": result
                    });
                }
            });
        });
    },
    login: (data) => {
        return new Promise((accept, reject) => {
            UserModel.authenticate(data.username, data.password)
                .then((data) => {
                    accept({
                        "status": 1,
                        "message": {
                            "id": data.id,
                            "token": data.token,
                            "tokenExpiry": data.tokenExpiry,
                            "security": data.security
                        }
                    });
                })
                .catch((err) => {
                    reject({
                        "status": 0,
                        "message": err
                    });
                });
        });
    },
    logout: (token) => {
        return new Promise((accept, reject) => {
            UserModel.deauthenticate(token)
                .then((data) => {
                    accept({
                        "status": 1,
                        "message": ""
                    });
                })
                .catch((err) => {
                    reject({
                        "status": 0,
                        "message": err
                    });
                });
        });
    },
    reauthenticate: (token) => {
        return new Promise((accept, reject) => {
            UserModel.reauthenticate(token)
                .then((user) => {
                    accept({
                        "status": 1,
                        "message": user
                    });
                })
                .catch((err) => {
                    reject({
                        "status": 0,
                        "message": err
                    });
                });
        });
    }
}