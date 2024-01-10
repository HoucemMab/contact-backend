// app.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import the cors middleware

const app = express();
const PORT = process.env.PORT || 3005;

// Connexion à MongoDB
mongoose.connect(
  "mongodb+srv://houcem:houcem@cluster0.29zpygz.mongodb.net/carspark?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Middleware pour parser le corps des requêtes
app.use(bodyParser.json());
app.use(cors());

// Définition du modèle de contact
const ContactSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  age: Number,
  linkToWebsite: String,
  tags: [String],
});

const Contact = mongoose.model("Contact", ContactSchema);

// Routes CRUD pour les contacts
app.post("/contacts", async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).send(contact);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.send(contacts);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/contacts/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).send({ message: "Contact not found" });
    }
    res.send(contact);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.patch("/contacts/:id", async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!contact) {
      return res.status(404).send({ message: "Contact not found" });
    }
    res.send(contact);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete("/contacts/:id", async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).send({ message: "Contact not found" });
    }
    res.send(contact);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
