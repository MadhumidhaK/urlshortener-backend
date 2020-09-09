const bcrypt = require('bcrypt');

const saltRounds = 10;

exports.getHashedPassword = (plainTextPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err){
                reject(err)
            }
            bcrypt.hash(plainTextPassword, salt, function(err, hashedPassword) {
                if(err){
                    console.log(err)
                    reject(err);
                }
                console.log("..")
                resolve(hashedPassword)
            });
        });
    })
}

exports.comparePassword = (plainTextPassword, hashedPassword) => {
   return new Promise((resolve, reject) => {
            bcrypt.compare(plainTextPassword, hashedPassword, function(err, result) {
                if(err){
                    reject(err);
                }
                resolve(result);
            });
   })
}