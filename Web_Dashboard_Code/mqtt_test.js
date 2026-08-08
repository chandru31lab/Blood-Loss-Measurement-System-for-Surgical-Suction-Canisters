import mqtt from 'mqtt';

console.log("Connecting to MQTT...");
const client = mqtt.connect('****************', {
  clientId: 'node_test_' + Math.random().toString(16).substr(2, 8),
  username: '************',
  password: '**********',
  rejectUnauthorized: false
});

client.on('connect', () => {
  console.log('Connected to MQTT via Node!');
  client.subscribe('medical/blood_loss/data', (err) => {
    if (!err) {
      console.log('Subscribed to topic');
    }
  });
});

client.on('message', (topic, message) => {
  console.log(`Received on ${topic}: ${message.toString()}`);
});

client.on('error', (err) => {
  console.error('Connection error:', err);
});
