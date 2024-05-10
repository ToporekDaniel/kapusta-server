//tutaj lądują wszystkie nasze routery

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
