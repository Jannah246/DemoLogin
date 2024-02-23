import UserModel from "../model/User.model.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import ENV from '../config.js'
import otpGenerator from 'otp-generator'
import { AdminData } from './../database/static';

// Middleware for verifying user
export async function verifyUser(req, res, next) {
    try {
        const { username } = req.method == 'GET' ? req.query : req.body;
        //check the existence of the user 
        let exist = await UserModel.findOne({ username })
        if(!exist) return res.status(404).send({ error: "User not found"})
        next()
    } catch (error) {
        return res.status(404).send({ error: "Authentication error"})
    }
}

export async function verifyAdmin(req, res, next) {
  try {
    const { username } = req.method == 'GET' ? req.query : req.body;
    let exist = AdminData.username === username
    if(!exist) return res.status(404).send({ error: "Admin not found"})
    next();
  } catch (error) {
    return res.status(404).send({ error: "Authentication error"})
  }
}

/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/
export async function register(req, res) {
  try {
    const { username, password, profile, email } = req.body;

    // check the existing user
    const existUsername = new Promise((resolve, reject) => {
      UserModel.findOne({ username })
        .then((user) => {
          reject({ error: "Please use unique username" });
        })
        .catch((err) => {
          reject(new Error(err));
        });

      resolve();
    });

    // check for existing email
    const existEmail = new Promise((resolve, reject) => {
      UserModel.findOne({ email }).then(email => {
        reject({ error: "Please use unique Email" })
      }).catch((err) => {
        reject(new Error(err))
      });

      resolve();
    });

    Promise.all([existUsername, existEmail])
      .then(() => {
        if (password) {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              const user = new UserModel({
                username,
                password: hashedPassword,
                profile: profile || "",
                email,
              });

              // return save result as a response
              user
                .save()
                .then((result) =>
                  res.status(201).send({ msg: "User Register Successfully" })
                )
                .catch((error) =>
                  res.status(500).send({ error: " from save error: " })
                );
            })
            .catch((error) => {
              return res.status(500).send({
                error: "Enable to hashed password",
              });
            });
        }
      })
      .catch((error) => {
        return res
          .status(500)
          .send({ error: "Evideyo Entho thakarar pole" + error.message });
      });
  } catch (error) {
    return res.status(500).send(error);
  }
}

/** POST: http://localhost:8080/api/login 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
}
*/
export async function login(req, res) {
  try {
    const { username, password } = req.body;
    UserModel.findOne({username})
        .then(user => {
            bcrypt.compare(password, user.password)
                .then(passwordCheck => {
                    if(!passwordCheck) return res.status(404).send({ error: "EncPassword is empty"})

                    // creating a JWT token
                    const token = jwt.sign({
                        userId: user._id,
                        username: user.username,
                    }, ENV.JWT_SECRET, { expiresIn: "24h"})

                    return res.status(200).send({
                        message: 'login successful',
                        username: user.username,
                        token
                    })
                })
                .catch(error => {
                    return res.status(404).send({ error: "Password Not Match"})
                })
        })
        .catch(error => {
            return res.status(404).send({ error: "User Not Found" });
        })
  } catch (error) {
    return res.status(500).send(error);
  }
}

// GET: http://localhost:8080/api/user/example123
export async function getUser(req, res) {
  const { username } = req.params;
  try {
    if(!username) return res.status(501).send({ error: "Invalid Username.." });

    UserModel.findOne({ username }).then((user)=>{
      if(!user) return res.status(501).send({ error: "Couldn't find user" });
      
      // removing unwanted password from userdata and returning the neccessary data from resulted object.
      const { password, ...rest } = Object.assign({}, user.toJSON());
      return res.status(201).send(rest);
    }).catch((error)=>{
      return res.status(404).send(error);
    })

  } catch (error) {
    return res.status(404).send({ error: "Userdata Not Found" });
  }
}

/** PUT: http://localhost:8080/updateuser
 * @param : {
  "id" : "<userid>",
}
*/
export async function updateUser(req, res) {
  try {
    // const id = req.query.id;
    const { userId } = req.user
    if(userId){
      const body = req.body;

      // update the data 
      UserModel.updateOne({ _id: userId }, body).then(() => {
        return res.status(201).send({ msg: 'User updated successfully' })
      }).catch(err => {
        throw err
      })
    }else{
      return res.status(401).send({ error: "User not found.." });
    }
  } catch (error) {
    return res.status(401).send({ error: "Error on update"+error.message })
  }
}

// GET: http://localhost:8080/api/generateOTP
export async function generateOTP(req, res) {
  req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
  res.status(201).send({ code: req.app.locals.OTP })
}

// GET: http://localhost:8080/api/verifyOTP
export async function verifyOTP(req, res) {
  const { code } = req.query;
  if(parseInt(req.app.locals.OTP) === parseInt(code)){
    req.app.locals.OTP = null;// resetting otp value
    req.app.locals.resetSession = true;// starting session for reset password
    return res.status(201).send({ msg: 'Verified successfully' });
  }
  return res.status(400).send("Invalid OTP")
} 

// GET: http://localhost:8080/api/createResetSession
export async function createResetSession(req, res) {
  if(req.app.locals.resetSession){
    // req.app.locals.resetSession = false // allow access to this route once 
    return res.status(201).send({ flag: req.app.locals.resetSession })
  }
  return res.status(440).send({error:"Session expired."})
}

// PUT: http://localhost:8080/api/resetPassword
export async function resetPassword(req, res) {
  try {
    if(!req.app.locals.resetSession) return res.status(440).send({error:"Session expired."})

    const { username, password } = req.body;
    try {
      UserModel.findOne({ username })
        .then(user => {
          bcrypt.hash(password, 10)
            .then(hashedPassword => {
              UserModel.updateOne({ username: user.username }, { password: hashedPassword })
                .then(data => {
                  return res.status(201).send({ msg: 'Password changed successfully' });
                })
                .catch(err => {
                  throw err
                })
            })
            .catch(error => {
              return res.status(500).send({ error: "Unable to hash password." });
            })
        })
        .catch(error => {
          return res.status(404).send({ error: "Username not found.." })
        })
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  } catch (error) {
    return res.status(401).send({ error: error.message })
  }
}

export async function getAllUsers(req, res) {
  try {
    UserModel.find({}, { password: 0 }).then(data => {
      res.status(201).send(data)
    })
  } catch (error) {
    return res.status(401).send("Cannot Fetch User data", error.message)
  }
}

