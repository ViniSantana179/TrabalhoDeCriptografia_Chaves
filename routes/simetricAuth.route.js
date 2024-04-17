const express = require("express");
const router = express.Router();

// Controller
const {
  encryptData,
  decryptData,
  keyGenerator,
  loadView,
} = require("../controllers/simetricController");

router.get("/", loadView);
router.post("/encript", encryptData);
router.post("/decript", decryptData);
router.post("/keyGenerate", keyGenerator);

module.exports = router;
