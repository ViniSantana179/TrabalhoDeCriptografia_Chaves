const express = require("express");
const exphbs = require("express-handlebars");

const app = express();

// Cofigurando os templates
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

app.use(express.static("public"));

// Configurando as url
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const simetric = require("./routes/simetricAuth.route");
const assimetric = require("./routes/assimetricAuth.route");

app.use("/simetric", simetric);
app.use("/assimetric", assimetric);

app.get("/", (req, res) => {
  res.render("home");
});

app.post("/", (req, res) => {
  res.render("home");
});

app.listen(3000, () => {
  console.log("Server is running");
});
