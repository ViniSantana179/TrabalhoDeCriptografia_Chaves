const crypto = require("crypto");
const config = require("../config");
const { text } = require("express");

const { secret_key, secret_iv, encryption_method } = config;

if (!secret_key || !secret_iv || !encryption_method) {
  throw new Error("secretKey, secretIV, and ecnryptionMethod are required");
}

// Generate secret hash with crypto to use for encryption
const keyGenerator = (req, res) => {
  const key = crypto
    .createHash("sha256")
    .update(secret_key + gerarLetrasAleatorias())
    .digest("hex")
    .substring(0, 32);
  res.render("simetric", { chave: key });
};

const encryptionIV = crypto
  .createHash("sha256")
  .update(secret_iv)
  .digest("hex")
  .substring(0, 16);

// Encrypt data
const encryptData = (req, res) => {
  const { texto, chave } = req.body;
  if (!texto || !chave)
    res.sendStatus(404).json({ msg: "Texto ou Chave Invalidos." });
  try {
    const cipher = crypto.createCipheriv(
      encryption_method,
      chave,
      encryptionIV
    );
    const encriptedData = Buffer.from(
      cipher.update(texto, "utf8", "hex") + cipher.final("hex")
    ).toString("base64"); // Encrypts data and converts to hex and base64
    res.render("simetric", { texto: encriptedData, chave: chave });
  } catch (error) {
    res.render("simetric", { texto: "", chave: "" });
  }
};

// Decrypt data
const decryptData = (req, res) => {
  const { texto, chave } = req.body;
  if (!texto || !chave)
    res.sendStatus(404).json({ msg: "Texto ou Chave Invalidos." });
  try {
    const buff = Buffer.from(texto, "base64");
    const decipher = crypto.createDecipheriv(
      encryption_method,
      chave,
      encryptionIV
    );
    const decriptedData =
      decipher.update(buff.toString("utf8"), "hex", "utf8") +
      decipher.final("utf8"); // Decrypts data and converts to utf8
    res.render("simetric", { texto: decriptedData, chave: chave });
  } catch (error) {
    res.render("simetric", { texto: "", chave: "" });
  }
};

const loadView = (req, res) => {
  res.render("simetric");
};

function gerarLetrasAleatorias() {
  return Array.from({ length: 8 }, () =>
    String.fromCharCode(97 + Math.floor(Math.random() * 26))
  ).join("");
}

module.exports = { encryptData, decryptData, keyGenerator, loadView };
