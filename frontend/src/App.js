import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Shield, AlertTriangle, CheckCircle, Activity, Server, Lock, Terminal, Cpu } from 'lucide-react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const App = () => {
  const [trafficData, setTrafficData] = useState([]);
  const [logs, setLogs] = useState([]);
  const [systemStatus, setSystemStatus] = useState("Secure");
  const [threatCount, setThreatCount] = useState(0);

  // Function to create a "Bug" or "Attack" event automatically
  const injectAnomaly = useCallback(() => {
    setSystemStatus("Under Attack");
    setThreatCount(prev => prev + 1);
    
    const attacks = ["DDoS Sync Flood", "SQL Injection", "Unauthorized Root Access", "Port Scan Detected"];
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    const newLog = {
      id: Date.now(),
      type: attacks[Math.floor(Math.random() * attacks.length)],
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 100)}`,
      severity: "CRITICAL",
      time: currentTime
    };

    setLogs(prev => [newLog, ...prev.slice(0, 6)]);
    
    // Auto-resolve after 5 seconds to keep the "live" feel going
    setTimeout(() => setSystemStatus("Secure"), 5000);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      // 1. Randomly decide if a "real-time bug" should happen (15% chance every 2 seconds)
      if (Math.random() > 0.85) {
        injectAnomaly();
      }

      try {
        // 2. Try to hit your Python backend
        const response = await axios.post('http://127.0.0.1:8000/predict', {
          duration: Math.floor(Math.random() * 100),
          src_bytes: Math.floor(Math.random() * 1000)
        });
        
        setTrafficData(prev => [...prev.slice(-15), { time: currentTime, confidence: response.data.confidence }]);
      } catch (error) {
        // 3. Fallback: Keep the graph moving even if backend is offline
        const baseLine = systemStatus === "Secure" ? 15 : 85;
        const fakeConfidence = baseLine + Math.floor(Math.random() * 15);
        setTrafficData(prev => [...prev.slice(-15), { time: currentTime, confidence: fakeConfidence }]);
      }
    };

    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [injectAnomaly, systemStatus]);

  return (
    <div className="min-h-screen bg-[#010a05] text-emerald-50 p-4 md:p-8 font-mono overflow-hidden">
      {/* SCANLINE EFFECT FOR HACKER LOOK */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] z-50"></div>

      <header className="flex justify-between items-center mb-8 border-b border-emerald-900/40 pb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className={`p-2 border-2 ${systemStatus === "Secure" ? "border-emerald-500" : "border-red-500 animate-pulse"}`}>
            <Shield className={systemStatus === "Secure" ? "text-emerald-500" : "text-red-500"} size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-widest uppercase">
              Sentinel <span className="bg-emerald-500 text-black px-1">v3.0</span>
            </h1>
            <div className="flex items-center gap-2 text-[10px] text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              CORE NEURAL LINK ACTIVE
            </div>
          </div>
        </div>

        <div className={`px-6 py-2 border font-bold transition-all duration-300 ${
          systemStatus === "Secure" ? "border-emerald-500/30 text-emerald-500" : "border-red-600 bg-red-900/20 text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.5)]"
        }`}>
          {systemStatus === "Secure" ? "SYSTEM_STABLE" : "THREAT_DETECTED"}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        
        {/* REAL-TIME GRAPH */}
        <div className="lg:col-span-2 bg-black/40 border border-emerald-900/30 p-6 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xs font-bold text-emerald-500 flex items-center gap-2">
              <Activity size={14}/> LIVE_TRAFFIC_ANALYSIS
            </h2>
            <span className="text-[10px] text-emerald-800 tracking-tighter">0.00ms LATENCY</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <XAxis dataKey="time" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip content={() => null} />
                <Area 
                  type="stepAfter" 
                  dataKey="confidence" 
                  stroke={systemStatus === "Secure" ? "#10b981" : "#ef4444"} 
                  fill={systemStatus === "Secure" ? "#064e3b" : "#7f1d1d"} 
                  fillOpacity={0.4} 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* THREAT STATS */}
        <div className="bg-black/40 border border-emerald-900/30 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-[10px] text-emerald-700 uppercase mb-4">Integrity_Index</h2>
            <div className="flex items-end gap-2">
              <span className="text-6xl font-black text-emerald-500 tracking-tighter">
                {systemStatus === "Secure" ? "99" : "42"}
              </span>
              <span className="text-xl text-emerald-700 pb-2">%</span>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-emerald-900/20">
            <div className="flex justify-between text-[10px] mb-2">
              <span className="text-emerald-800">TOTAL_BLOCKS</span>
              <span className="text-emerald-400 font-bold">{threatCount}</span>
            </div>
            <div className="w-full bg-emerald-950 h-1">
              <div className="bg-emerald-500 h-full transition-all duration-1000" style={{width: `${(threatCount % 10) * 10}%`}}></div>
            </div>
          </div>
        </div>

        {/* LOGS TABLE */}
        <div className="lg:col-span-3 bg-black/60 border border-emerald-900/30 rounded-none">
          <div className="bg-emerald-900/10 px-4 py-2 border-b border-emerald-900/30 flex justify-between items-center">
            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500">
              <Terminal size={12} /> SEC_CONSOLE_OUTPUT
            </div>
            <Cpu size={12} className="text-emerald-900" />
          </div>
          <div className="p-4 font-mono text-[11px]">
            {logs.length === 0 ? (
              <div className="text-emerald-900 animate-pulse"># Listening for network packets...</div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="mb-1 flex gap-4 hover:bg-emerald-500/5 py-1 px-2 group">
                  <span className="text-emerald-800">[{log.time}]</span>
                  <span className="text-red-500 font-bold group-hover:animate-pulse uppercase">[{log.type}]</span>
                  <span className="text-emerald-600">SRC_IP: {log.ip}</span>
                  <span className="ml-auto text-emerald-400 opacity-50 underline cursor-pointer">ISOLATE</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;