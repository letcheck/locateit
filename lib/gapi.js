var googleapis = require('googleapis'),
    OAuth2Client = googleapis.OAuth2Client,
    client = '942271616855.apps.googleusercontent.com',
    secret = 'K7ch9b3J_H1yTtRa5RvqkF6D',
    redirect = 'http://localhost:3000/oauth2callback',
    oauth2Client = new OAuth2Client(client, secret, redirect);
	

var url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: 'https://www.googleapis.com/auth/plus.login'
});

function getProfile(){
	oauth2.userinfo.get().withAuthClient(oauth2Client).execute(function(err, results){
      console.log(results);
	});
}

var callback = function(clients) {
  console.log(clients);
  exports.oauth = clients.oauth2;
  exports.plus = clients.plus;
  exports.client = oauth2Client;
  exports.url = url;
  exports.get = getProfile;
};


googleapis
  .discover('plus', 'v1')
  .discover('oauth2', 'v2')
  .execute(function(err, client){
    if(!err)
      callback(client);
  });