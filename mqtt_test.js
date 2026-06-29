import mqtt from 'mqtt';

console.log("Connecting to MQTT...");
const client = mqtt.connect('mqtts://g7c2f900.ala.asia-southeast1.emqxsl.com:8883', {
  clientId: 'node_test_' + Math.random().toString(16).substr(2, 8),
  username: 'blood_loss',
  password: '12345678',
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
