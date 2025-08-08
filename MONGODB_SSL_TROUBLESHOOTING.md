# MongoDB SSL/TLS Connection Error Troubleshooting

## Error Description
The error `MongoServerSelectionError: SSL routines:ssl3_read_bytes:tlsv1 alert internal error` indicates an SSL/TLS connection issue between your application and MongoDB Atlas.

## Root Cause
This error typically occurs when:
1. MongoDB client is not properly configured for SSL/TLS connections
2. Network connectivity issues with MongoDB Atlas
3. Incorrect MongoDB URI format
4. SSL certificate validation problems

## Solutions Implemented

### 1. Enhanced MongoDB Client Configuration
Updated `lib/mongodb.ts` with proper SSL/TLS options:
- Enabled SSL/TLS with `ssl: true`
- Added SSL validation with `sslValidate: true`
- Configured connection timeouts and retry settings
- Added connection pooling for better performance

### 2. Connection Retry Logic
Implemented exponential backoff retry mechanism:
- Maximum 3 retry attempts
- Exponential backoff delay between retries
- Detailed error logging for debugging

### 3. Environment-Specific Configuration
Added production-specific SSL settings:
- `tlsAllowInvalidCertificates: false`
- `tlsAllowInvalidHostnames: false`

## MongoDB URI Format
Ensure your MongoDB URI follows this format:
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

## Environment Variables
Make sure these environment variables are properly set:

### Production (.env.production)
```env
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/freelance-tracker
NODE_ENV=production
NEXTAUTH_SECRET=your-super-secret-key-minimum-32-characters-long
NEXTAUTH_URL=https://your-domain.com
```

### Development (.env.local)
```env
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/freelance-tracker
NODE_ENV=development
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

## Additional Troubleshooting Steps

### 1. Verify MongoDB Atlas Configuration
- Ensure your IP address is whitelisted in MongoDB Atlas
- Check that the database user has proper permissions
- Verify the cluster is running and accessible

### 2. Network Connectivity
- Test connection from your deployment environment
- Check firewall settings
- Verify DNS resolution for MongoDB Atlas endpoints

### 3. MongoDB Driver Version
Ensure you're using a compatible MongoDB driver version:
```bash
npm list mongodb
```

### 4. Test Connection
Create a simple test script to verify MongoDB connectivity:
```javascript
const { MongoClient } = require('mongodb');

async function testConnection() {
  const client = new MongoClient(process.env.MONGODB_URI, {
    ssl: true,
    sslValidate: true,
    retryWrites: true,
    serverSelectionTimeoutMS: 5000
  });
  
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');
    await client.db().admin().ping();
    console.log('Ping successful');
  } catch (error) {
    console.error('Connection failed:', error);
  } finally {
    await client.close();
  }
}

testConnection();
```

## Monitoring and Logging
The updated configuration includes enhanced logging:
- Connection success/failure messages
- Retry attempt logging
- Detailed error information

## Production Deployment Checklist
- [ ] MongoDB URI is correctly formatted
- [ ] Environment variables are set
- [ ] IP whitelist includes deployment server IPs
- [ ] Database user has proper permissions
- [ ] SSL/TLS is properly configured
- [ ] Connection pooling is optimized
- [ ] Error handling and retry logic is in place

## Common Issues and Solutions

### Issue: "IP not whitelisted"
**Solution:** Add your deployment server's IP to MongoDB Atlas whitelist

### Issue: "Authentication failed"
**Solution:** Verify username/password and database permissions

### Issue: "Connection timeout"
**Solution:** Check network connectivity and increase timeout values

### Issue: "SSL certificate errors"
**Solution:** Ensure SSL is properly configured and certificates are valid

## Support
If issues persist:
1. Check MongoDB Atlas status page
2. Review MongoDB driver documentation
3. Contact MongoDB Atlas support
4. Check application logs for detailed error messages