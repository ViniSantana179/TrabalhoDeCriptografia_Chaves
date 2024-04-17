const crypto = require("crypto");
const fs = require("fs/promises");
const util = require("util");

const config = require("../config");

const { secret_key, secret_iv, encryption_method } = config;

if (!encryption_method) {
  throw new Error("encryptionMethod is required");
}

// Gerar um par de chaves RSA
const generateKeyPair = util.promisify(crypto.generateKeyPair);
const generateRSAKeys = async (req, res) => {
  try {
    const { publicKey, privateKey } = await generateKeyPair("rsa", {
      modulusLength: 2048, // Tamanho da chave em bits
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });
    await Promise.all([
      fs.writeFile("public_key.pem", publicKey),
      fs.writeFile("private_key.pem", privateKey),
    ]);
    res.render("assimetric", { public: publicKey });
  } catch (error) {
    console.error("Erro ao gerar o par de chaves RSA:", error);
  }
};

// Função para carregar a chave pública
const loadPublicKey = async () => {
  try {
    const publicKey = await fs.readFile("public_key.pem", "utf8");
    return publicKey;
  } catch (error) {
    console.error("Erro ao carregar a chave pública:", error);
    return null;
  }
};

// Função para carregar a chave privada
const loadPrivateKey = async () => {
  try {
    const privateKey = await fs.readFile("private_key.pem", "utf8");
    return privateKey;
  } catch (error) {
    console.error("Erro ao carregar a chave privada:", error);
    return null;
  }
};

// Encrypt data using public key
const encryptAssData = async (req, res) => {
  const { texto } = req.body;
  if (!texto) {
    res.status(400).json({ msg: "Texto inválido." });
    return;
  }

  try {
    const publicKey = await loadPublicKey();
    if (!publicKey) {
      res.status(500).json({ msg: "Erro ao carregar a chave pública." });
      return;
    }

    const encryptedData = crypto.publicEncrypt(publicKey, Buffer.from(texto));
    res.status(200).render("assimetric", {
      public: publicKey,
      texto: encryptedData.toString("base64"),
    });
  } catch (error) {
    console.error("Erro ao criptografar dados:", error);
    res.status(500).json({ msg: "Erro ao criptografar dados." });
  }
};

// Decrypt data using private key
const decryptAssData = async (req, res) => {
  const { texto } = req.body;
  if (!texto) {
    res.status(400).json({ msg: "Texto inválido." });
    return;
  }

  try {
    const privateKey = await loadPrivateKey();
    if (!privateKey) {
      res.status(500).json({ msg: "Erro ao carregar a chave privada." });
      return;
    }

    const decryptedData = crypto.privateDecrypt(
      {
        key: privateKey,
        passphrase: "",
      },
      Buffer.from(texto, "base64")
    );
    res
      .status(200)
      .render("assimetric", { texto: decryptedData.toString("utf8") });
  } catch (error) {
    console.error("Erro ao descriptografar dados:", error);
    res.status(500).json({ msg: "Erro ao descriptografar dados." });
  }
};

const loadView = (req, res) => {
  res.render("assimetric");
};

module.exports = { generateRSAKeys, encryptAssData, decryptAssData, loadView };
