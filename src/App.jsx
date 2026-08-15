import React, { useState } from 'react';

export default function App() {
  const [hardwareGrid, setHardwareGrid] = useState([]);
  const [apiLogs, setApiLogs] = useState([]);

  const addHardwareNode = (type) => {
    const total = hardwareGrid.length;
    const node = {
      id: `node_${Math.random().toString(36).substr(2, 5)}`,
      type,
      x: (total % 3) * 90 + 20,
      y: Math.floor(total / 3) * 85 + 25
    };
    setHardwareGrid([...hardwareGrid, node]);
  };

  const clearCanvas = () => {
    setHardwareGrid([]);
    setApiLogs([]);
  };

  const contactVercelSolver = async () => {
    setApiLogs(["Connecting to serverless matrix resolver..."]);
    try {
      const response = await fetch(`${import.meta.env.VITE_VERCEL_BACKEND_URL}/api/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ elements: hardwareGrid })
      });
      const parsed = await response.json();
      if (parsed.success) {
        setApiLogs(parsed.telemetry.map(t => `[${t.type}] => Draw: ${t.current} | State: ${t.status}`));
      }
    } catch (e) {
      setApiLogs([`Execution error: ${e.message}`]);
    }
  };

  return (
    <div style={{ color: '#e2e8f0', fontFamily: 'system-ui, sans-serif', padding: '14px', minHeight: '100vh' }}>
      <header style={{ marginBottom: '12px' }}>
        <h3 style={{ margin: '0 0 4px 0', color: '#06b6d4' }}>GitHub Engine: IoT Simulator</h3>
        <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Created and built entirely in-browser.</p>
      </header>

      {/* Button Layout Row */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <button onClick={() => addHardwareNode('Microcontroller')} style={{ padding: '8px 12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px' }}>+ MCU Core</button>
        <button onClick={() => addHardwareNode('LED')} style={{ padding: '8px 12px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px' }}>+ LED Node</button>
        <button onClick={clearCanvas} style={{ padding: '8px 12px', background: '#475569', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px' }}>Clear</button>
        <button onClick={contactVercelSolver} style={{ padding: '8px 12px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px', marginLeft: 'auto' }}>Run Logic</button>
      </div>

      {/* Touch Canvas */}
      <div style={{ width: '100%', height: '260px', background: '#0f172a', borderRadius: '6px', border: '1px solid #334155', position: 'relative', overflowY: 'auto' }}>
        {hardwareGrid.map(item => (
          <div key={item.id} style={{ position: 'absolute', left: `${item.x}px`, top: `${item.y}px`, padding: '8px', background: '#1e293b', border: '1px solid #475569', borderRadius: '4px', minWidth: '65px', textAlign: 'center' }}>
            <span style={{ fontSize: '18px' }}>{item.type === 'Microcontroller' ? '🤖' : '🚨'}</span>
            <div style={{ fontSize: '10px', marginTop: '4px', fontWeight: 'bold' }}>{item.type}</div>
          </div>
        ))}
      </div>

      {/* Real-time System Analytics */}
      <h5 style={{ margin: '16px 0 6px 0', color: '#94a3b8', fontSize: '12px', uppercase: 'true' }}>Vercel Engine Diagnostics</h5>
      <div style={{ padding: '10px', background: '#020617', border: '1px solid #1e293b', borderRadius: '4px', minHeight: '90px', fontFamily: 'monospace', fontSize: '11px', color: '#34d399', lineHeight: '1.5' }}>
        {apiLogs.length === 0 ? "Terminal Standby. Place nodes on canvas and select 'Run Logic'." : apiLogs.map((log, index) => <div key={index}>{log}</div>)}
      </div>
    </div>
  );
}

