const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
console.log('JWT_SECRET from env:', process.env.JWT_SECRET);
console.log('JWT_SECRET used:', JWT_SECRET);

// Test token generation and verification
const userId = '68953ed14d81cadc202bf86e';
const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
console.log('Generated token:', token);

// Test verification
try {
  const decoded = jwt.verify(token, JWT_SECRET);
  console.log('Token verification successful:', decoded);
} catch (error) {
  console.log('Token verification failed:', error.message);
}

// Test with different secret
const wrongSecret = 'your-super-secret-jwt-key-change-this-in-production';
try {
  const decoded2 = jwt.verify(token, wrongSecret);
  console.log('Token verification with different secret successful:', decoded2);
} catch (error) {
  console.log('Token verification with different secret failed:', error.message);
}