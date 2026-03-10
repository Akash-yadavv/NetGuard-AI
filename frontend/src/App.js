import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, AlertTriangle, CheckCircle, Activity, Server, Lock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const App = () => {
  const [trafficData, setTrafficData] = useState([]);
  const [logs, setLogs] = useState([]);
  const [systemStatus, setSystemStatus] = useState("Secure");
  const [threatCount, setThreatCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Generate fake traffic to test the AI
      const fakeTraffic = {
        duration: Math.floor(Math.random() * 1000),
        src_bytes: Math.floor(Math.random() * 50000),
        dst_bytes: Math.floor(Math.random() * 50000),
        logged_in: Math.random() > 0.8 ? 1 : 0,
        count: Math.floor(Math.random() * 500),
        srv_count: Math.floor(Math.random() * 500)
      };

      try {
        // 2. Send data to Python Backend
        const response = await axios.post('http://127.0.0.1:8000/predict', fakeTraffic);
        const result = response.data;

        // 3. Update Graph
        const currentTime = new Date().toLocaleTimeString();
        setTrafficData(prev => [...prev.slice(-10), { time: currentTime, confidence: result.confidence }]);

        // 4. Update Dashboard Status
        if (result.status === "Attack") {
          setSystemStatus("Under Attack");
          setThreatCount(prev => prev + 1);
          const newLog = {
            id: Date.now(),
            type: result.threat_type,
            ip: "192.168.1." + Math.floor(Math.random() * 255),
            severity: "Critical",
            time: currentTime
          };
          setLogs(prev => [newLog, ...prev.slice(0, 5)]);
        } else {
          setSystemStatus("Secure");
        }
      } catch (error) {
        console.error("Backend offline:", error);
        setSystemStatus("Offline");
      }
    };

    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 font-sans">
      <header className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
        <div className="flex items-center gap-3">
          <Shield className="w-10 h-10 text-cyan-400" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
            AI Cyber Sentinel
          </h1>
        </div>
        <div className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 ${
          systemStatus === "Secure" ? "bg-green-500/20 text-green-400" : 
          systemStatus === "Offline" ? "bg-gray-500/20 text-gray-400" : "bg-red-500/20 text-red-500 animate-pulse"
        }`}>
          {systemStatus === "Secure" ? <CheckCircle size={20}/> : <AlertTriangle size={20}/>}
          {systemStatus}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Graph Card */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg col-span-2">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="text-blue-400"/> Live Traffic Confidence
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData}>
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none'}}/>
                <Line type="monotone" dataKey="confidence" stroke="#22d3ee" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-center items-center">
          <h2 className="text-xl font-semibold mb-2 text-slate-400">Total Threats Blocked</h2>
          <span className="text-6xl font-bold text-red-500 drop-shadow-lg">{threatCount}</span>
          <div className="mt-6 flex gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1"><Server size={14}/> Port 80</div>
            <div className="flex items-center gap-1"><Lock size={14}/> SSH</div>
          </div>
        </div>

        {/* Logs Card */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg col-span-3">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="text-yellow-500"/> Recent Alerts
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="pb-2">Time</th>
                  <th className="pb-2">Attack Type</th>
                  <th className="pb-2">Source IP</th>
                  <th className="pb-2">Severity</th>
                  <th className="pb-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr><td className="py-4 text-center text-slate-500" colSpan="5">No active threats detected.</td></tr>
                ) : (
                  logs.map(log => (
                    <tr key={log.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition">
                      <td className="py-3 text-sm">{log.time}</td>
                      <td className="py-3 font-mono text-yellow-400">{log.type}</td>
                      <td className="py-3 font-mono text-slate-300">{log.ip}</td>
                      <td className="py-3"><span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs">CRITICAL</span></td>
                      <td className="py-3 text-cyan-400 cursor-pointer hover:underline">Block IP</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;