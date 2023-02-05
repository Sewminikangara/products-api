const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post("/api/customers", (req, res) => {
  const { name, address, email, dateOfBirth, gender, age, cardHolderName, cardNumber, expirydate, cvv, timeStamp } = req.body;

  // Validate email address
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  // Validate credit card number
  if (!/^\d{12}$/.test(cardNumber)) {
    return res.status(400).json({ message: "Invalid credit card number" });
  }

  db.run(
    "INSERT INTO customer (name, address, email, dateOfBirth, gender, age, cardHolderName, cardNumber, expirydate, cvv, timeStamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [name, address, email, dateOfBirth, gender, age, cardHolderName, cardNumber, expirydate, cvv, timeStamp],
    function (err) {
      if (err) {
        return res.status(400).json({ message: "An error occurred" });
      }
      res.status(201).json({ message: `Customer ${name} has registered`, customerId: this.lastID });
    }
  );
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
