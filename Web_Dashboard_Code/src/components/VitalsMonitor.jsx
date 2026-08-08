import React, { useEffect, useRef, useState } from 'react';

const VitalsMonitor = () => {
  const ecgCanvasRef = useRef(null);
  const spo2CanvasRef = useRef(null);
  
  const [hr, setHr] = useState(72);
  const [spo2, setSpo2] = useState(98);
  const [sys, setSys] = useState(120);
  const [dia, setDia] = useState(80);

  // Simulate vitals changing slightly
  useEffect(() => {
    const interval = setInterval(() => {
      setHr(prev => {
        const newHr = prev + (Math.random() > 0.5 ? 1 : -1);
        return newHr > 100 ? 100 : newHr < 60 ? 60 : newHr;
      });
      
      if (Math.random() > 0.8) {
        setSpo2(prev => (prev === 99 ? 98 : prev === 98 ? 99 : 98));
      }
      
      if (Math.random() > 0.9) {
        setSys(prev => prev + Math.floor(Math.random() * 5 - 2));
        setDia(prev => prev + Math.floor(Math.random() * 5 - 2));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Draw ECG Waveform
  useEffect(() => {
    const canvas = ecgCanvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Canvas dimensions
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    
    let x = 0;
    let prevX = 0;
    let prevY = canvas.height / 2;
    
    const drawWave = () => {
      // Clear a small rectangle ahead of the current x to erase old trace
      ctx.clearRect(x, 0, 15, canvas.height);
      
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      
      x += 2;
      
      // Simulate QRS complex based on x position
      let y = canvas.height / 2;
      
      // Every ~200px draw a heartbeat
      if (x % 200 > 180 && x % 200 < 195) {
        if (x % 200 === 182) y -= 10; // P wave
        else if (x % 200 === 186) y += 20; // Q wave
        else if (x % 200 === 188) y -= 80; // R wave
        else if (x % 200 === 190) y += 30; // S wave
        else if (x % 200 === 194) y -= 15; // T wave
      } else {
        // Add slight noise
        y += (Math.random() - 0.5) * 4;
      }
      
      ctx.lineTo(x, y);
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      prevX = x;
      prevY = y;
      
      if (x > canvas.width) {
        x = 0;
        prevX = 0;
      }
      
      animationFrameId = requestAnimationFrame(drawWave);
    };
    
    drawWave();
    
    const handleResize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Draw SpO2 Waveform
  useEffect(() => {
    const canvas = spo2CanvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    
    let x = 0;
    let prevX = 0;
    let prevY = canvas.height / 2;
    let time = 0;
    
    const drawWave = () => {
      ctx.clearRect(x, 0, 15, canvas.height);
      
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      
      x += 1.5;
      time += 0.05;
      
      // SpO2 waveform is typically a smoother pulsatile wave
      let y = canvas.height / 2 - Math.sin(time) * 30 - Math.sin(time * 2) * 10;
      
      ctx.lineTo(x, y);
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      prevX = x;
      prevY = y;
      
      if (x > canvas.width) {
        x = 0;
        prevX = 0;
      }
      
      animationFrameId = requestAnimationFrame(drawWave);
    };
    
    drawWave();
    
    const handleResize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="vitals-monitor">
      
      {/* ECG Row */}
      <div className="vital-row vital-ecg">
        <div className="vital-waveform">
          <canvas ref={ecgCanvasRef}></canvas>
        </div>
        <div className="vital-data">
          <div className="vital-label">ECG</div>
          <div className="vital-value">{hr}</div>
          <div className="vital-unit">bpm</div>
        </div>
      </div>

      {/* SpO2 Row */}
      <div className="vital-row vital-spo2">
        <div className="vital-waveform">
          <canvas ref={spo2CanvasRef}></canvas>
        </div>
        <div className="vital-data">
          <div className="vital-label">SpO2</div>
          <div className="vital-value">{spo2}</div>
          <div className="vital-unit">%</div>
        </div>
      </div>

      {/* NIBP Row */}
      <div className="vital-row vital-nibp">
        <div className="vital-waveform" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <div style={{ fontSize: '1.5rem', opacity: 0.5, letterSpacing: '2px' }}>AUTO - 5 MIN</div>
        </div>
        <div className="vital-data">
          <div className="vital-label">NIBP</div>
          <div className="vital-value" style={{ fontSize: '3.5rem' }}>
            {sys}<span style={{ fontSize: '2rem', opacity: 0.7 }}>/{dia}</span>
          </div>
          <div className="vital-unit">mmHg</div>
          <div className="vital-unit" style={{ marginTop: '10px' }}>MAP ({Math.round((sys + 2 * dia) / 3)})</div>
        </div>
      </div>

    </div>
  );
};

export default VitalsMonitor;
