const {google} = require('googleapis');

const CLIENT_ID ='373697671784-fn2hhqgarft9lb7v0rbdjleckfh0lgh0.apps.googleusercontent.com';
const CLIENT_SECRET ='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';
const REDIRECT_URL ='https://developers.google.com/oauthplayground';

const REFRESH_TOKEN = '1//04lJnON2X0oQvCgYIARAAGAQSNwF-L9Ir8sTOq6a7R2o9OFss9lOmebxtM6RJiQ09FnNCGtaVnFryhZnrxf4lloW2kVE8kkecrsk';


const oauth2Client = new google.auth.OAuth2(
   CLIENT_ID,
   CLIENT_SECRET,
   REDIRECT_URL
  );
oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

const drive = google.drive({
  version:'v3',
  auth: oauth2Client
})

const fileUpload = async(newname, filepath){

  try{

    const response = await drive.files.create({
      requestBody: {
        name: newname,
        mimeTypes: 'image/jpg'
      },
      media: {
        mimeTypes: 'image/jpg',
        body: filepath
      }
    });
    console.log(response.data);

    return response.data.id;

  }catch(e){
    console.log(e);
    throw new Error(e);
  }

}

const fileview = async(){

}