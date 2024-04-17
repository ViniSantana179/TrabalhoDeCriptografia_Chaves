const express = require("express");
const router = express.Router();

// Controller
const {
  encryptAssData,
  decryptAssData,
  generateRSAKeys,
  loadView,
} = require("../controllers/assimetricController");

router.get("/", loadView);
router.post("/encript", encryptAssData);
router.post("/decript", decryptAssData);
router.post("/keyGenerate", generateRSAKeys);

module.exports = router;
