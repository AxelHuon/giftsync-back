const crypto = require("crypto");
function generateApiKey() {
  return crypto.randomBytes(32).toString("hex"); // génère une clé de 64 caractères
}

const newApiKey = generateApiKey();
console.log(`Generated API key: ${newApiKey}`);
