import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, AlertTriangle, CheckCircle, Activity, Server, Lock, Terminal } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const App = () => {
  const [trafficData, setTrafficData] = useState([]);
  const [logs, setLogs] = useState([]);
  const [systemStatus, setSystemStatus] = useState("Secure");
  const [threatCount, setThreatCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const fakeTraffic = {
        duration: Math.floor(Math.random() * 1000),
        src_bytes: Math.floor(Math.random() * 50000),
        dst_bytes: Math.floor(Math.random() * 50000),
        logged_in: Math.random() > 0.8 ? 1 : 0,
        count: Math.floor(Math.random() * 500),
        srv_count: Math.floor(Math.random() * 500)
      };

      try {
        const response = await axios.post('http://127.0.0.1:8000/predict', fakeTraffic);
        const result = response.data;
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        setTrafficData(prev => [...prev.slice(-15), { time: currentTime, confidence: result.confidence }]);

        if (result.status === "Attack") {
          setSystemStatus("Under Attack");
          setThreatCount(prev => prev + 1);
          const newLog = {
            id: Date.now(),
            type: result.threat_type || "Anomalous Traffic",
            ip: "10.0.0." + Math.floor(Math.random() * 255),
            severity: "CRITICAL",
            time: currentTime
          };
          setLogs(prev => [newLog, ...prev.slice(0, 7)]);
        } else {
          setSystemStatus("Secure");
        }
      } catch (error) {
        setSystemStatus("Offline");
      }
    };

    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    // DARK GREEN BACKGROUND WITH RADIAL GRADIENT
    <div className="min-h-screen bg-[#020d08] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#042014] via-[#020d08] to-[#010603] text-emerald-50 p-4 md:p-8 font-mono">
      
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-emerald-900/50 pb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Shield className="w-12 h-12 text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic">
              AI <span className="text-emerald-500">Sentinel</span>
            </h1>
            <p className="text-[10px] text-emerald-700 tracking-[0.3em] uppercase">Neural Threat Mitigation</p>
          </div>
        </div>

        <div className={`mt-4 md:mt-0 px-6 py-2 border rounded-none skew-x-[-12deg] font-bold flex items-center gap-3 transition-colors duration-500 ${
          systemStatus === "Secure" ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" : 
          systemStatus === "Offline" ? "border-zinc-700 bg-zinc-900 text-zinc-500" : "border-red-500 bg-red-500/20 text-red-500 animate-pulse"
        }`}>
          {systemStatus === "Secure" ? <CheckCircle size={18}/> : <AlertTriangle size={18}/>}
          <span className="skew-x-[12deg]">{systemStatus.toUpperCase()}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* MAIN CHART - 3/4 WIDTH */}
        <div className="lg:col-span-3 bg-[#03160e]/80 border border-emerald-900/30 backdrop-blur-md p-6 rounded-sm shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/40"></div>
          <h2 className="text-sm font-bold mb-6 flex items-center gap-2 text-emerald-400/80 uppercase tracking-widest">
            <Activity size={16} className="animate-pulse"/> Network Pulse / Confidence Level
          </h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorConf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#064e3b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#064e3b" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#020d08', border: '1px solid #065f46', borderRadius: '0px'}}
                  itemStyle={{color: '#10b981'}}
                />
                <Area type="monotone" dataKey="confidence" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorConf)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* THREAT COUNTER - 1/4 WIDTH */}
        <div className="bg-[#03160e]/80 border border-emerald-900/30 p-6 rounded-sm flex flex-col justify-between relative">
           <div className="absolute top-0 right-0 p-2 opacity-10">
              <Shield size={80} />
           </div>
           <div>
            <h2 className="text-xs font-bold text-emerald-700 uppercase tracking-tighter">Neutralized Threats</h2>
            <div className="text-7xl font-black text-emerald-500 mt-2 tracking-tighter">
              {threatCount.toString().padStart(2, '0')}
            </div>
           </div>
           <div className="space-y-3 mt-8">
              <div className="flex justify-between items-center text-[10px] border-b border-emerald-900/30 pb-1">
                <span className="text-emerald-700 flex items-center gap-1"><Server size={10}/> UPLINK</span>
                <span className="text-emerald-400">ACTIVE</span>
              </div>
              <div className="flex justify-between items-center text-[10px] border-b border-emerald-900/30 pb-1">
                <span className="text-emerald-700 flex items-center gap-1"><Lock size={10}/> ENCRYPTION</span>
                <span className="text-emerald-400">AES-256</span>
              </div>
           </div>
        </div>

        {/* RECENT ALERTS - FULL WIDTH */}
        <div className="lg:col-span-4 bg-[#010906] border border-emerald-900/20 rounded-sm">
          <div className="px-6 py-4 border-b border-emerald-900/30 bg-emerald-950/10 flex items-center gap-2">
            <Terminal size={16} className="text-emerald-500"/>
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-500">System Logs / Incident Reports</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] uppercase text-emerald-700 tracking-wider">
                  <th className="px-6 py-4 font-medium">Timestamp</th>
                  <th className="px-6 py-4 font-medium">Vector</th>
                  <th className="px-6 py-4 font-medium">Origin_ID</th>
                  <th className="px-6 py-4 font-medium">Severity</th>
                  <th className="px-6 py-4 font-medium text-right">Protocol</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {logs.length === 0 ? (
                  <tr><td className="px-6 py-10 text-center text-emerald-900 italic" colSpan="5">Scanning network for anomalies...</td></tr>
                ) : (
                  logs.map(log => (
                    <tr key={log.id} className="border-t border-emerald-900/10 hover:bg-emerald-500/5 transition-colors group">
                      <td className="px-6 py-4 text-emerald-600 font-mono">{log.time}</td>
                      <td className="px-6 py-4 font-bold text-emerald-200">{log.type}</td>
                      <td className="px-6 py-4 font-mono text-emerald-500">{log.ip}</td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] border border-red-500/50 text-red-500 px-2 py-0.5 rounded-none font-bold">
                          {log.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-[10px] text-emerald-500 border border-emerald-500/30 px-3 py-1 hover:bg-emerald-500 hover:text-black transition-all uppercase font-bold">
                          Purge
                        </button>
                      </td>
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