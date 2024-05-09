//tutaj tworzymy kontrolery dla naszych endpointów

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
