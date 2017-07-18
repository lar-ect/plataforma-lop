const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("User");

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/github/callback"
  },
  async (accessToken, refreshToken, githubData, done) => {
    const email = githubData._json.email;
    console.log(`Tentando autenticar com o github utilizando email: ${email}`);

    let user = await User.findOne({ email });

    if(!user) {
      console.log(`Nenhum usuário cadastrado com o email: ${email}, criando novo usuário`);
      user = new User({
        email,
        nome: githubData._json.name,
        githubData
      });
      
    } else {
      user.githubData = githubData;
    }
    
    user.markModified("githubData");
    user = await user.save();
    done(null, user);
  }
));