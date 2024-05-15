//tutaj lądują wszystkie nasze routery

const  App  = require("./../app");
const userController = require('../controllers/userController');
const express = require('express');
const router = express.Router();


// przykładowy który wykorzystuje tą obsługę błędów
// to jest tylko przykład jak to może wyglądać a nie gotowy element
// chodzi o sam wzorzec byśmy się wszyscy trzymali tego samego

router.post("/verify", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "missing required field email" });
  }
  try {
    await sendAnotherToken(email);
    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
    //to jest to miejsce gdzie obsługujemy błędy z tego HttpError
    // throw new HttpError("Verification has already been passed", 400);
    // throw new HttpError("User not found", 404);
    // oba błędy zostaną obsłużone w jednym miejscu
  }
});
///////////////////////////////////////
// async function verify() {
//   const ticket = await App.oAuth2Client.verifyIdToken({
//       idToken: token,
//       audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
//       // Or, if multiple clients access the backend:
//       //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
//   });
//   const payload = ticket.getPayload();
//   const userid = payload['sub'];
//   // If the request specified a Google Workspace domain:
//   // const domain = payload['hd'];
// }
// verify().catch(console.error);




router.get("/", userController.user);


module.exports =  router;
