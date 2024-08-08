import { initializeApp, cert} from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import express from "express"
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import cors from 'cors';
const app = express()
dotenv.config();

app.use(express.json())

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
  projectId:process.env.PROJECT_ID
})


app.post("/send", (req, res) => {
  const { fcmtoken, notification, data } = req.body;
  console.log(fcmtoken, notification, data);

  if (!fcmtoken) {
    return res.json({
      statuscode: "400",
      message: "fcm token is missing"
    });
  }

  if (!notification) {
    return res.json({
      statuscode: "400",
      message: "notification is missing"
    });
  }

  if (!data) {
    return res.json({
      statuscode: "400",
      message: "data is missing"
    });
  }

  const message = {
    notification: notification,
    tokens: fcmtoken,
    data: data
  };

  getMessaging().sendEachForMulticast(message)
    .then((_response) => {
      console.log("Successfully sent message");
      res.json({
        statuscode: 200,
        message: "message sent successfully"
      });
    })
    .catch((error) => {
      console.log('Error sending message:', error);
      res.status(500).json({
        statuscode: "500",
        message: "Error sending message"
      });
    });
});


app.get("/",(req,res)=>{
   res.json({
     statuscode:200,
     message:"connection ok"
   })
})

app.listen(5000, () => {
  console.log("MY server is running under 5000")
})