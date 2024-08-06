import { initializeApp, cert} from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import express, { json, response } from "express"
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import cors from 'cors';
const app = express()
dotenv.config();

app.use(express.json())

console.log(process.env.FIREBASE_UNIVERSE_DOMAIN,"++")

// middlewares
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cors())


initializeApp({
  credential:cert({
    type:process.env.FIREBASE_TYPE,
    project_id:process.env.FIREBASE_PROJECT_ID,
    private_key_id:process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key:process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email:process.env.FIREBASE_CLIENT_EMAIL,
    client_id:process.env.FIREBASE_CLIENT_ID,
    auth_uri:process.env.FIREBASE_AUTH_URI,
    token_uri:process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url:process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url:process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain:process.env.FIREBASE_UNIVERSE_DOMAIN 
  }),
  projectId: "qai-tanara"
})



app.post("/send", (req, res) => {
  const {fcmtoken,notification}= req.body
  const message = {
    notification:notification,
    token:fcmtoken
  };
  getMessaging().send(message)
    .then((_reponse) => {
      console.log("Successfully sent message")
      res.json({
        statuscode: 200,
        message: "message sending sucess"
      })
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
})

app.listen(5000, () => {
  console.log("MY server is running under 5000")
})