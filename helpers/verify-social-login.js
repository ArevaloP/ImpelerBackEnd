const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function GoogleVerify(token = '') {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
  });
  const {given_name, family_name, email, picture} = ticket.getPayload();

  return {
      nombre: given_name,
      apellido: family_name,
      email: email,
      img: picture
  }
  
  



}


module.exports = {
    GoogleVerify
}