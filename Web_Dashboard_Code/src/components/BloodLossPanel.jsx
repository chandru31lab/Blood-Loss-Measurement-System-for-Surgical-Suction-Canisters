import React from 'react';
import { Droplet, Activity, Container } from 'lucide-react';

const BloodLossPanel = ({ bloodVol, totalVol, bloodPercent }) => {
  return (
    <div className="blood-loss-panel">
      <div className="blood-panel-title">
        <Droplet style={{ display: 'inline', marginRight: '10px', verticalAlign: 'middle' }} />
        Blood Loss Measurement
      </div>

      <div className="blood-metric">
        <div className="blood-metric-label">Live Blood Loss</div>
        <div className="blood-metric-value">{bloodVol.toFixed(1)}</div>
        <div className="blood-metric-unit">milliliters (ml)</div>
      </div>

      <div className="blood-metric" style={{ '--color-blood': '#ffffff' }}>
        <div className="blood-metric-label">Total Fluid Volume</div>
        <div className="blood-metric-value" style={{ color: '#ffffff', textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>
          {totalVol.toFixed(1)}
        </div>
        <div className="blood-metric-unit">milliliters (ml)</div>
      </div>

      <div className="blood-metric" style={{ '--color-blood': '#ffaa00' }}>
        <div className="blood-metric-label">Blood Concentration</div>
        <div className="blood-metric-value" style={{ color: '#ffaa00', textShadow: '0 0 10px rgba(255, 170, 0, 0.5)' }}>
          {bloodPercent.toFixed(1)}<span style={{ fontSize: '2rem' }}>%</span>
        </div>
        <div className="blood-metric-unit">Average</div>
      </div>
      
      <div style={{ marginTop: 'auto', textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>
        <Activity style={{ display: 'inline', marginRight: '5px', width: '16px' }} className="blinking" />
        Monitoring Active
      </div>
    </div>
  );
};

export default BloodLossPanel;
