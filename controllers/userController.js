//tutaj tworzymy kontrolery dla naszych endpointów

const  App  = require("./../app");

// całkiem fajna opcja z tym HttpError
// wszystkie błędy zwracane przez funkcje są w jednym formacie
// łatwiej je obsłużyć w jednym miejscu i od razu ustalamy kod błędu
class HttpError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

//przykładowe wykorzystanie HttpError
const sendAnotherToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new HttpError("User not found", 404);
  }
  if (user.verify) {
    throw new HttpError("Verification has already been passed", 400);
  }
  user.verificationToken = uuid();
  await user.save();
  sendEmail(email, user.verificationToken);
};

///////////////////////////////////////////////////
async function verify(token) {
  const ticket = await App.oAuth2Client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();

  let name = payload.name, email = payload.email, img = payload.picture;

  return {
    name,
    email,
    img,
    google: true,
  };
}

const user = async (req, res, next) => {
  let token = "";
  let tokenHeader = req.headers["authorization"];
  let items = tokenHeader.split(/[ ]+/);
  if (items.length > 1 && items[0].trim().toLowerCase() == "bearer") {
    token = items[1];
  }

  if (token) {
    const user = await verify(token);
    if (user) {
      console.log("user: ", user);
    res.status(200).json({
      "user": user,
    });
    } else {
      console/log("no user");
    }
  } else {
    res.send("Please pass token");
  }
};

exports.user = user;
