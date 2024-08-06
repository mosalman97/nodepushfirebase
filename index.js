import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import express, { json, response } from "express"
import bodyParser from "body-parser";
import cors from 'cors';
const app = express()

app.use(express.json())

// middlewares
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cors())


initializeApp({
  credential: applicationDefault(),
  projectId: "qai-tanara"
})


app.post("/send", (req, res) => {
  const {fcmtoken}= req.body
  const message = {
    notification: {
      title: "Good Morning",
      body: "Game Show is Live Now"
    },
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