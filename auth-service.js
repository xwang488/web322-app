const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

let  userSchema = new Schema ({
    "userName":{
        "type": String,
        "unique": true
    },
    "password": String,
    "email": String,
    "loginHistory":[{
        "dateTime": Date,
        "userAgent": String
    }]
});

let User;
//connect to MongoDB
module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb+srv://dbUser:780421ASas@senecaweb.e9hko13.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true });

        db.on('error', (err)=>{
            reject(err); // reject the promise with the provided error
        });
        db.once('open', ()=>{
           User = db.model("users", userSchema);
           resolve();
        });
    });
};

//register new user
module.exports.registerUser= function(userData){
    return new Promise(function(resolve, reject){
        if(userData.password != userData.password2){
            reject("passwords do not match");
        }else{
            bcrypt.hash(userData.password,16).then(hash=>{
                userData.password = hash;
                let newUser = new User(userData);
                newUser.save((err)=>{
                    if(err){
                        if(err.code == 11000 ){
                            reject("User Name already taken.");
                        }else{
                            reject("There was an error creating the user:" + err);
                        }

                    }else{
                        resolve();
                    }
                });
            }).catch(err=>{
                reject("problem encrypting the password");
            });
        }

    });
}


// function that control user trying to login

module.exports.checkUser = function(userData){
    return new Promise(function(resolve, reject){
        User.find({userName: userData.userName}).
        exec()
        .then((users)=>{
            if(users.length==0){
                reject("Unable to find user: " + userData.userName);
            }else{
                bcrypt.compare(userData.password,users[0].password).then((res)=>{
                    if(res === true){
                        users[0].loginHistory.push({dateTime: (new Date()).toString(),userAgent: userData.userAgent});
                            
                            User.updateOne({userName: users[0].userName},
                            {$set: {loginHistory: users[0].loginHistory}}
                            ).exec()
                            .then(()=>{
                                resolve(users[0]);
                            }).catch((err)=>{
                                reject("There was an error verifying the user: " + err);

                            })
                    }else{
                        reject("Incorrect Password for user: "+ userData.userName );
                    }

                });
            }

        }).catch(()=>{
            reject("Unable to find user: " +userData.userName );

        });

    })
}