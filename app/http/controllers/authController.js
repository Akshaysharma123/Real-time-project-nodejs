const User = require('../../models/user')
const bcrypt = require('bcrypt');
const passport = require('passport');

function authController () {
  const _getRequest = (req) => {
    return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders';
  }
    return {

        login(req, res){
          res.render('auth/login');
        },

        postLogin(req, res, next){
          const {email, password} = req.body
          if (!email || !password){
            req.flash('error', 'All fields are required')
            return res.redirect('/login')
          }

          passport.authenticate('local', (err, user, info) => {
            
            if(err) {
                req.flash('error', info.message)
                return next(err)
              }

            if(!user) {
              req.flash('error', info.message)
              return res.redirect('/login')
            } 
            
            req.login(user, () => {
              if (err){
                req.flash('error', info.message)
                return next(error)
              }

              return res.redirect(_getRequest(req))
            })

          })(req, res, next)
        },

        register(req, res){
            res.render('auth/register');
          },
        
        async postRegister(req, res){
          const {name, email, password} = req.body;

          // validate request
          if (!name || !email || !password){
            req.flash('error', 'All fields are required')
            req.flash('name', name)
            req.flash('email', email)
            return res.redirect('/register')
          }

          // check email exists
          User.exists({email: email}, (err, result) => {
            if(result){
              req.flash('error', 'Email already taken')
              req.flash('name', name)
              req.flash('email', email)
              return res.redirect('/register')
            }
          })

          // hash password
          const hashedpassword = await bcrypt.hash(password, 10)

          // Create a user
          const user = new User({
            name: name,
            email: email,
            password: hashedpassword
          })

          user.save().then(() => {
            // login

            return res.redirect('/')
          }).catch(err =>{
            req.flash('error', 'somthing went wrong')
            return res.redirect('/register')  
          })
        },  

        logout(req, res) {
          req.logout()
          return res.redirect('/login')
        }
    }
}

module.exports = authController;