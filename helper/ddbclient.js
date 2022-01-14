const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

var endpoint = undefined;

if (["production","staging"].indexOf(process.env.NODE_ENV) == -1) {
endpoint = 'http://localhost:8000'
console.log(`Connecting to DynamoDB local endpoint on ${endpoint}`)
}
const ddbClient = new DynamoDBClient({
region: process.env.REGION || 'us-east-1',
endpoint: endpoint
});



module.exports = { ddbClient };