const crypto = require('crypto');
const secretKey = crypto.randomBytes(64).toString('hex');  // 64 bytes (512 bits)
console.log(secretKey);