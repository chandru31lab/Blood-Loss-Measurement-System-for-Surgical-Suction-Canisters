import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';
import VitalsMonitor from './components/VitalsMonitor';
import BloodLossPanel from './components/BloodLossPanel';
import { Activity, Clock } from 'lucide-react';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  
  // Blood Loss Data State
  const [bloodData, setBloodData] = useState({
    bloodVol: 0.0,
    totalVol: 0.0,
    bloodPercent: 0.0
  });

  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    // Update Clock
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    
    // Connect to MQTT Broker
    // Connect to public EMQX broker for testing
    const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt', {
      clientId: 'dashboard_' + Math.random().toString(16).substr(2, 8),
      keepalive: 60,
      reconnectPeriod: 5000,
      protocolVersion: 4,
      clean: true
    });

    client.on('connect', () => {
      console.log('Connected to MQTT Broker');
      setIsConnected(true);
      client.subscribe('medical/blood_loss/data');
    });

    client.on('message', (topic, message) => {
      if (topic === 'medical/blood_loss/data') {
        try {
          const payload = JSON.parse(message.toString());
          setBloodData({
            bloodVol: payload.blood_vol || 0,
            totalVol: payload.total_vol || 0,
            bloodPercent: payload.blood_percent || 0
          });
        } catch (e) {
          console.error("Failed to parse MQTT message:", e);
        }
      }
    });

    client.on('error', (err) => {
      console.error('MQTT Connection error: ', err);
      client.end();
    });

    client.on('close', () => {
      setIsConnected(false);
    });

    return () => {
      clearInterval(timer);
      if (client) {
        client.end();
      }
    };
  }, []);

  return (
    <>
      <header className="dashboard-header">
        <div className="patient-info">
          <span>BED 01</span>
          <span>DOE, JOHN</span>
          <span>M / 45</span>
        </div>
        
        <div className="system-status">
          <Clock size={18} /> <span>{time}</span>
          <span style={{ marginLeft: '20px' }}>MQTT SERVER:</span>
          <div className={`status-dot ${isConnected ? 'connected' : ''}`}></div>
          <span style={{ fontSize: '0.8rem', color: isConnected ? '#00ff00' : '#ff0000' }}>
            {isConnected ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
      </header>

      <main className="dashboard-content">
        <VitalsMonitor />
        <BloodLossPanel 
          bloodVol={bloodData.bloodVol}
          totalVol={bloodData.totalVol}
          bloodPercent={bloodData.bloodPercent}
        />
      </main>
    </>
  );
}

export default App;
