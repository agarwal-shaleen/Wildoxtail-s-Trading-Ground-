// import React, { useEffect, useState, useRef } from "react";
// import { io } from "socket.io-client";

// // --- STYLES (High-Fidelity Glassmorphism UI) ---
// const styles = `
// @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Roboto+Mono:wght@500&display=swap');

// :root {
//   --bg-dark: #0f1115;
//   --bg-panel: #181b21;
//   --bg-card: rgba(30, 35, 45, 0.9);
//   --accent-blue: #3b82f6;
//   --accent-green: #22c55e;
//   --accent-red: #ef4444;
//   --text-main: #f3f4f6;
//   --text-muted: #9ca3af;
//   --border-color: #2d3748;
// }

// body { margin: 0; font-family: 'Inter', sans-serif; background-color: var(--bg-dark); color: var(--text-main); height: 100vh; overflow: hidden; }
// .app-root { display: flex; flex-direction: column; height: 100vh; }

// /* HEADER */
// .top-panel { display: flex; justify-content: space-between; align-items: center; padding: 15px 30px; background-color: var(--bg-panel); border-bottom: 1px solid var(--border-color); }
// .header-title { font-weight: 800; font-size: 1.2rem; letter-spacing: 0.5px; }

// .game-container { display: flex; flex: 1; overflow: hidden; }

// /* TABLE AREA */
// .table-area { 
//   flex: 3; 
//   position: relative; 
//   display: flex; 
//   flex-direction: column;
//   justify-content: center; 
//   align-items: center; 
//   background: radial-gradient(circle at center, #1e2330 0%, #0f1115 70%); 
// }

// .poker-table { 
//   width: 680px; 
//   height: 380px; 
//   border: 2px solid #3b4555; 
//   border-radius: 200px; 
//   position: relative; 
//   background: rgba(255, 255, 255, 0.01); 
//   box-shadow: 0 0 60px rgba(0,0,0,0.6); 
//   margin-top: 60px; 
// }

// .table-center-content { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; z-index: 5; }

// /* PLAYER CARDS (10 SEATS) */
// .player-card {
//   position: absolute; width: 110px; padding: 10px;
//   background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px;
//   text-align: center; backdrop-filter: blur(10px); transition: all 0.3s ease; z-index: 10;
//   box-shadow: 0 4px 20px rgba(0,0,0,0.4);
// }
// .player-card.self { border-color: var(--accent-blue); box-shadow: 0 0 20px rgba(59, 130, 246, 0.2); transform: scale(1.1); z-index: 50; }
// .player-card.empty { opacity: 0.15; border-style: dashed; background: transparent; }
// .p-name { font-weight: 800; font-size: 0.85rem; margin-bottom: 3px; color: var(--text-main); white-space: nowrap; overflow: hidden; }
// .p-stats { font-size: 0.7rem; color: var(--text-muted); line-height: 1.3; }
// .stat-val { font-weight: 600; color: var(--text-main); }

// /* SEAT COORDINATES */
// .seat-0 { top: -65px; left: 50%; transform: translateX(-50%); } 
// .seat-1 { top: -10px; right: 15%; }
// .seat-2 { top: 30%; right: -80px; }
// .seat-3 { bottom: 30%; right: -80px; }
// .seat-4 { bottom: -10px; right: 15%; }
// .seat-5 { bottom: -65px; left: 50%; transform: translateX(-50%); } 
// .seat-6 { bottom: -10px; left: 15%; }
// .seat-7 { bottom: 30%; left: -80px; }
// .seat-8 { top: 30%; left: -80px; }
// .seat-9 { top: -10px; left: 15%; }

// /* SIDEBAR */
// .right-panel { flex: 1; max-width: 320px; background: var(--bg-panel); border-left: 1px solid var(--border-color); display: flex; flex-direction: column; padding: 25px; gap: 20px; overflow-y: auto; }
// .panel-header { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; font-weight: 700; }

// .price-input { width: 100%; box-sizing: border-box; background: #0f1115; border: 1px solid var(--border-color); color: white; padding: 15px; border-radius: 10px; text-align: center; font-family: 'Roboto Mono', monospace; font-size: 1.5rem; margin-bottom: 5px; outline: none; }
// .price-input:focus { border-color: var(--accent-blue); box-shadow: 0 0 10px rgba(59, 130, 246, 0.1); }

// .trade-error { color: var(--accent-red); font-size: 0.7rem; font-weight: 600; margin-bottom: 10px; text-align: center; height: 14px; }

// .btn-row { display: flex; gap: 10px; margin-bottom: 15px; }
// .btn-trade { flex: 1; padding: 16px; border-radius: 8px; border: none; font-weight: 800; cursor: pointer; color: white; transition: 0.2s; font-size: 1rem; }
// .btn-trade:active { transform: scale(0.96); }
// .btn-buy { background: var(--accent-green); color: #000; }
// .btn-sell { background: var(--accent-red); }

// /* LISTS */
// .list-container { flex: 1; overflow-y: auto; background: rgba(0,0,0,0.2); border-radius: 8px; padding: 10px; border: 1px solid #222; }
// .order-row { display: flex; justify-content: space-between; padding: 6px 10px; font-family: 'Roboto Mono', monospace; font-size: 0.85rem; border-radius: 4px; margin-bottom: 4px; }
// .order-row.ask { color: var(--accent-red); background: rgba(239, 68, 68, 0.05); }
// .order-row.bid { color: var(--accent-green); background: rgba(34, 197, 94, 0.05); }

// .trade-row { font-size: 0.7rem; padding: 6px 0; border-bottom: 1px solid #222; color: #aaa; }
// .trade-row strong { color: #fff; }

// /* DIGITS */
// .digits-container { position: absolute; top: 20px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 10px; z-index: 20; }
// .bubbles-row { display: flex; flex-direction: row !important; gap: 10px; justify-content: center; }
// .bubble { width: 44px; height: 44px; border-radius: 12px; background: #252b36; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.4rem; color: #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }

// .logout-btn { background: transparent; border: 1px solid var(--accent-red); color: var(--accent-red); padding: 8px 18px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: 700; transition: 0.2s; }
// .logout-btn:hover { background: var(--accent-red); color: white; }
// .start-btn { background: var(--accent-green); color: #000; border: none; padding: 14px 28px; border-radius: 10px; cursor: pointer; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3); }

// .game-over-modal { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.95); backdrop-filter: blur(12px); display:flex; align-items:center; justify-content:center; z-index:1000; }
// .copy-badge { background: #2d3748; padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 800; cursor: pointer; transition: 0.2s; }
// .copy-badge:hover { background: #4a5568; }
// `;

// const API_BASE = "http://localhost:4000/api/game";
// const socket = io("http://localhost:4000");

// // --- MAIN APP ---
// export default function App() {
//   const [player, setPlayer] = useState(() => JSON.parse(localStorage.getItem("axxela_player")));
//   const [roomCode, setRoomCode] = useState(() => localStorage.getItem("axxela_room"));
//   const [gameState, setGameState] = useState(null);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [verifying, setVerifying] = useState(!!(player && roomCode));
//   const [tradeError, setTradeError] = useState("");
//   const priceRef = useRef();

//   // Session Check
//   useEffect(() => {
//     const verify = async () => {
//       if (player && roomCode) {
//         try {
//           const res = await fetch(`${API_BASE}/state?roomCode=${roomCode}`);
//           if (res.status === 404) { handleLogout(); }
//           else {
//             const data = await res.json();
//             if (!data.players?.find(p => p.id === player.id)) { handleLogout(); }
//             else { setGameState(data); socket.emit('joinRoom', roomCode); }
//           }
//         } catch (e) { console.error("Sync Error:", e); }
//       }
//       setVerifying(false);
//     };
//     verify();
//   }, []);

//   // Real-time Update
//   useEffect(() => {
//     const onStateUpdate = (data) => {
//       if (data.roomCode === roomCode) setGameState(data);
//     };
//     socket.on("gameState", onStateUpdate);
//     const ticker = setInterval(() => {
//       if (gameState) {
//         const target = gameState.status === 'active' ? gameState.roundEndTime : gameState.intermissionEndTime;
//         if (target) setTimeLeft(Math.max(0, Math.floor((target - Date.now()) / 1000)));
//       }
//     }, 1000);
//     return () => { socket.off("gameState", onStateUpdate); clearInterval(ticker); };
//   }, [roomCode, gameState]);

//   const handleLogout = () => {
//     if (player && roomCode) {
//       fetch(`${API_BASE}/leave`, {
//         method: "POST", headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ playerId: player.id, roomCode })
//       }).catch(() => {});
//     }
//     localStorage.clear();
//     setPlayer(null);
//     setRoomCode(null);
//     setGameState(null);
//     setVerifying(false);
//   };

//   const onRegistered = (p, code) => {
//     setPlayer(p); setRoomCode(code);
//     localStorage.setItem("axxela_player", JSON.stringify(p));
//     localStorage.setItem("axxela_room", code);
//     socket.emit('joinRoom', code);
//   };

//   const copyRoomCode = () => {
//     navigator.clipboard.writeText(roomCode);
//     alert("Room code copied!");
//   };

//   const placeOrder = async (side) => {
//     setTradeError("");
//     const price = Number(priceRef.current.value);
//     if (!price || !player || !roomCode) return;
    
//     try {
//         const res = await fetch(`${API_BASE}/order`, {
//             method: "POST", headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ playerId: player.id, roomCode, price, side })
//         });
//         const data = await res.json();
//         if (res.status >= 400) {
//             setTradeError(data.error || "Order Rejected");
//             setTimeout(() => setTradeError(""), 3000);
//         } else {
//             priceRef.current.value = "";
//         }
//     } catch (e) { setTradeError("Network Error"); }
//   };

//   const formatTime = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

//   if (verifying) return <div style={{ background: '#0f1115', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.2rem' }}>Syncing with Market...</div>;

//   return (
//     <div className="app-root">
//       <style>{styles}</style>
      
//       <div className="top-panel">
//         <span className="header-title">AXXELA <span style={{color:'var(--accent-blue)'}}>TRADING</span></span>
//         {roomCode && (
//           <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
//             <span onClick={copyRoomCode} className="copy-badge">ROOM: <span style={{ color: 'var(--accent-blue)' }}>{roomCode} 📋</span></span>
//             {gameState && gameState.status !== 'waiting' && (
//                 <span style={{ fontFamily: 'Roboto Mono', color: 'var(--accent-blue)', fontWeight: 800, fontSize:'1.1rem' }}>
//                     R{gameState.round} | {formatTime(timeLeft)}
//                 </span>
//             )}
//           </div>
//         )}
//         {player && <button onClick={handleLogout} className="logout-btn">LEAVE ROOM</button>}
//       </div>

//       <div className="game-container">
//         {!player ? (
//           <div style={{ margin: 'auto' }}><JoinScreen onRegistered={onRegistered} /></div>
//         ) : !gameState ? (
//           <div style={{ margin: 'auto', textAlign: 'center', color: '#9ca3af' }}>Loading room data...</div>
//         ) : (
//           <>
//             <div className="table-area">
//               <div className="digits-container">
//                 <span className="panel-header">Revealed Sequence</span>
//                 <div className="bubbles-row">
//                   {(gameState.revealedDigits || []).map((d, i) => <div key={i} className="bubble">{d}</div>)}
//                   {Array(6 - (gameState.revealedDigits?.length || 0)).fill(0).map((_, i) => <div key={i} className="bubble" style={{ opacity: 0.1 }}>?</div>)}
//                 </div>
//               </div>

//               <div className="poker-table">
//                 {/* Market Price label/value removed as requested */}
//                 <div className="table-center-content">
//                   {gameState.players?.find(p => p.id === player.id)?.isHost && gameState.status === 'waiting' && (
//                     <button onClick={() => fetch(`${API_BASE}/start`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ roomCode }) })} className="start-btn">Start Session</button>
//                   )}
//                 </div>

//                 {Array(10).fill(null).map((_, i) => {
//                   const s = gameState.players?.[i];
//                   return (
//                     <div key={i} className={`player-card seat-${i} ${s?.id === player.id ? 'self' : ''} ${!s ? 'empty' : ''}`}>
//                       <div className="p-name">{s ? s.id : ''}</div>
//                       {s && (
//                         <div className="p-stats">
//                           Pos: <span className="stat-val">{s.openPosition}</span><br />
//                           PnL: <span style={{ color: s.pnl >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }} className="stat-val">{s.pnl}</span>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             <div className="right-panel">
//               <div>
//                 <div className="panel-header">Place Order</div>
//                 <input type="number" className="price-input" ref={priceRef} placeholder="00" autoFocus />
//                 <div className="trade-error">{tradeError}</div>
//                 <div className="btn-row">
//                   <button className="btn-trade btn-buy" onClick={() => placeOrder('buy')}>BUY</button>
//                   <button className="btn-trade btn-sell" onClick={() => placeOrder('sell')}>SELL</button>
//                 </div>
//               </div>

//               <div className="book-container">
//                 <div style={{flex: 1}}>
//                   <div className="panel-header" style={{ color: 'var(--accent-red)', borderBottom:'1px solid #333', paddingBottom:5 }}>Asks (Sells)</div>
//                   <div className="list-container">
//                     {(gameState.sellOrders || []).sort((a, b) => a.price - b.price).map(o => (
//                         <div key={o.id} className="order-row ask"><span>{o.price}</span><span>{o.playerId}</span></div>
//                     ))}
//                   </div>
//                 </div>
//                 <div style={{flex: 1}}>
//                   <div className="panel-header" style={{ color: 'var(--accent-green)', borderBottom:'1px solid #333', paddingBottom:5, marginTop:5 }}>Bids (Buys)</div>
//                   <div className="list-container">
//                     {(gameState.buyOrders || []).sort((a, b) => b.price - a.price).map(o => (
//                         <div key={o.id} className="order-row bid"><span>{o.price}</span><span>{o.playerId}</span></div>
//                     ))}
//                   </div>
//                 </div>
                
//                 <div style={{height: 180, display: 'flex', flexDirection:'column'}}>
//                   <div className="panel-header" style={{ borderBottom:'1px solid #333', paddingBottom:5 }}>Trade History</div>
//                   <div className="list-container">
//                     {(gameState.trades || []).map(t => (
//                       <div key={t.id} className="trade-row">
//                         [{t.timestamp || 'now'}] <strong>{t.buyer}</strong> bought from <strong>{t.seller}</strong> @ <strong>{t.price}</strong>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {gameState?.status === 'ended' && (
//         <div className="game-over-modal">
//           <div style={{ background: '#161b22', padding: 50, borderRadius: 32, textAlign: 'center', border: '1px solid #30363d', minWidth: 400, boxShadow: '0 0 100px rgba(0,0,0,0.8)' }}>
//             <h1 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1rem', letterSpacing: 3 }}>FINAL TRUE SUM</h1>
//             <div style={{ fontSize: '6rem', color: 'var(--accent-green)', fontWeight: 800, margin: '10px 0' }}>{gameState.finalSum}</div>
//             <div style={{ marginTop: 30, textAlign: 'left', maxHeight: 300, overflowY: 'auto' }}>
//               <div className="panel-header" style={{ borderBottom: '1px solid #333', paddingBottom: 10, marginBottom: 15 }}>LEADERBOARD</div>
//               {(gameState.players || []).sort((a, b) => b.pnl - a.pnl).map((p, idx) => (
//                 <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #222' }}>
//                   <span style={{ fontWeight: p.id === player?.id ? 800 : 400, fontSize:'1.1rem' }}>#{idx + 1} {p.id} {p.id === player?.id ? '(YOU)' : ''}</span>
//                   <span style={{ color: p.pnl >= 0 ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 800 }}>{p.pnl > 0 ? '+' : ''}{p.pnl}</span>
//                 </div>
//               ))}
//             </div>
//             {gameState.players?.find(p => p.id === player.id)?.isHost && (
//               <button onClick={() => fetch(`${API_BASE}/start`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ roomCode }) })} style={{ marginTop: 40, width: '100%', padding: 18, background: 'var(--accent-blue)', color: 'white', border: 'none', borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>RESTART GAME</button>
//             )}
//           </div>
//         </div>
//       )}

//       {gameState?.players?.find(p => p.id === player?.id)?.isHost && <AdminTools roomCode={roomCode} />}
//     </div>
//   );
// }

// function JoinScreen({ onRegistered }) {
//   const [mode, setMode] = useState("join");
//   const [initials, setInitials] = useState("");
//   const [code, setCode] = useState("");
//   const [error, setError] = useState("");

//   const submit = async (e) => {
//     e.preventDefault(); setError("");
//     try {
//       let activeCode = code;
//       if (mode === 'create') {
//         const r1 = await fetch(`${API_BASE}/create`, { method: "POST" });
//         const d1 = await r1.json();
//         activeCode = d1.roomCode;
//       }
//       const r2 = await fetch(`${API_BASE}/join`, {
//         method: "POST", headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ initials, roomCode: activeCode })
//       });
//       const d2 = await r2.json();
//       if (d2.error) setError(d2.error); else onRegistered(d2.player, activeCode);
//     } catch (err) { setError("Server is offline."); }
//   };

//   return (
//     <div style={{ background: '#181b21', padding: 45, borderRadius: 28, border: '1px solid #2d3748', width: 330, textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }}>
//       <div style={{ display: 'flex', marginBottom: 30, background: '#0f1115', borderRadius: 14, padding: 5 }}>
//         <button onClick={() => setMode('join')} style={{ flex: 1, padding: 14, borderRadius: 10, border: 'none', cursor: 'pointer', background: mode === 'join' ? '#3b82f6' : 'transparent', color: mode === 'join' ? 'white' : '#9ca3af', fontWeight: 800 }}>JOIN</button>
//         <button onClick={() => setMode('create')} style={{ flex: 1, padding: 14, borderRadius: 10, border: 'none', cursor: 'pointer', background: mode === 'create' ? '#3b82f6' : 'transparent', color: mode === 'create' ? 'white' : '#9ca3af', fontWeight: 800 }}>CREATE</button>
//       </div>
//       <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
//         {mode === 'join' && <input style={{ padding: 16, background: '#0f1115', border: '1px solid #333', color: 'white', textAlign:'center', borderRadius: 12, fontSize: '1.2rem' }} placeholder="ROOM CODE" value={code} onChange={e => setCode(e.target.value.toUpperCase())} maxLength={4} required />}
//         <input style={{ padding: 16, background: '#0f1115', border: '1px solid #333', color: 'white', textAlign:'center', borderRadius: 12, fontSize: '1.2rem' }} placeholder="INITIALS" value={initials} onChange={e => setInitials(e.target.value.toUpperCase())} maxLength={3} required />
//         <button style={{ padding: 18, background: mode === 'join' ? '#22c55e' : '#3b82f6', color: mode === 'join' ? '#000' : '#fff', border: 'none', borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>{mode.toUpperCase()}</button>
//       </form>
//       {error && <div style={{ color: 'var(--accent-red)', marginTop: 20, fontSize: '0.9rem' }}>{error}</div>}
//     </div>
//   );
// }

// function AdminTools({ roomCode }) {
//   const [open, setOpen] = useState(false);
//   const act = (ep) => fetch(`${API_BASE}${ep}`, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ roomCode }) });
//   if (!open) return <button onClick={()=>setOpen(true)} style={{ position: 'fixed', bottom: 30, right: 30, background: 'rgba(255,255,255,0.08)', border: '1px solid #444', borderRadius: '50%', width: 50, height: 50, cursor: 'pointer', fontSize: '1.4rem' }}>⚙️</button>;
//   return (
//     <div style={{ position: 'fixed', bottom: 30, right: 30, background: '#1c2128', border: '1px solid #444', padding: 25, borderRadius: 20, zIndex: 3000 }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}><strong>HOST OVERRIDE</strong><button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer' }}>×</button></div>
//       <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
//         <button onClick={()=>act('/start')} style={{ background: '#22c55e', border: 'none', padding: 14, borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}>RESTART SESSION</button>
//         <button onClick={()=>act('/admin/advance')} style={{ background: '#ef4444', color: 'white', border: 'none', padding: 14, borderRadius: 8, cursor: 'pointer' }}>FORCE NEXT ROUND</button>
//       </div>
//     </div>
//   );
// }



import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

// --- STYLES ---
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Roboto+Mono:wght@500&display=swap');

:root {
  --bg-dark: #0f1115;
  --bg-panel: #181b21;
  --bg-card: rgba(30, 35, 45, 0.9);
  --accent-blue: #3b82f6;
  --accent-green: #22c55e;
  --accent-red: #ef4444;
  --accent-yellow: #f59e0b;
  --text-main: #f3f4f6;
  --text-muted: #9ca3af;
  --border-color: #2d3748;
}

body { margin: 0; font-family: 'Inter', sans-serif; background-color: var(--bg-dark); color: var(--text-main); height: 100vh; overflow: hidden; }
.app-root { display: flex; flex-direction: column; height: 100vh; }

.top-panel { display: flex; justify-content: space-between; align-items: center; padding: 15px 30px; background-color: var(--bg-panel); border-bottom: 1px solid var(--border-color); }
.header-title { font-weight: 800; font-size: 1.2rem; letter-spacing: 0.5px; }

.game-container { display: flex; flex: 1; overflow: hidden; }

/* TABLE AREA */
.table-area { flex: 3; position: relative; display: flex; flex-direction: column; justify-content: center; align-items: center; background: radial-gradient(circle at center, #1e2330 0%, #0f1115 70%); }
.poker-table { width: 680px; height: 380px; border: 2px solid #3b4555; border-radius: 200px; position: relative; background: rgba(255, 255, 255, 0.01); box-shadow: 0 0 60px rgba(0,0,0,0.6); margin-top: 60px; }

.table-center-content { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; z-index: 5; }

/* PLAYER CARDS */
.player-card {
  position: absolute; width: 110px; padding: 10px;
  background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px;
  text-align: center; backdrop-filter: blur(10px); transition: all 0.3s ease; z-index: 10;
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
}
.player-card.self { border-color: var(--accent-blue); box-shadow: 0 0 20px rgba(59, 130, 246, 0.2); transform: scale(1.1); z-index: 50; }
.player-card.empty { opacity: 0.15; border-style: dashed; background: transparent; }
.p-name { font-weight: 800; font-size: 0.85rem; margin-bottom: 3px; color: var(--text-main); white-space: nowrap; overflow: hidden; }
.p-stats { font-size: 0.7rem; color: var(--text-muted); line-height: 1.3; }
.stat-val { font-weight: 600; color: var(--text-main); }

/* SEAT COORDINATES */
.seat-0 { top: -65px; left: 50%; transform: translateX(-50%); } 
.seat-1 { top: -10px; right: 15%; } .seat-2 { top: 30%; right: -80px; } .seat-3 { bottom: 30%; right: -80px; } .seat-4 { bottom: -10px; right: 15%; }
.seat-5 { bottom: -65px; left: 50%; transform: translateX(-50%); } 
.seat-6 { bottom: -10px; left: 15%; } .seat-7 { bottom: 30%; left: -80px; } .seat-8 { top: 30%; left: -80px; } .seat-9 { top: -10px; left: 15%; }

/* SIDEBAR */
.right-panel { flex: 1; max-width: 320px; background: var(--bg-panel); border-left: 1px solid var(--border-color); display: flex; flex-direction: column; padding: 25px; gap: 20px; overflow-y: auto; }
.panel-header { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; font-weight: 700; }

.price-input { width: 100%; box-sizing: border-box; background: #0f1115; border: 1px solid var(--border-color); color: white; padding: 15px; border-radius: 10px; text-align: center; font-family: 'Roboto Mono', monospace; font-size: 1.5rem; margin-bottom: 5px; outline: none; }
.price-input:focus { border-color: var(--accent-blue); box-shadow: 0 0 10px rgba(59, 130, 246, 0.1); }

.trade-error { color: var(--accent-red); font-size: 0.7rem; font-weight: 600; margin-bottom: 10px; text-align: center; height: 14px; }

.btn-row { display: flex; gap: 10px; margin-bottom: 15px; }
.btn-trade { flex: 1; padding: 16px; border-radius: 8px; border: none; font-weight: 800; cursor: pointer; color: white; transition: 0.2s; font-size: 1rem; }
.btn-trade:active { transform: scale(0.96); }
.btn-buy { background: var(--accent-green); color: #000; }
.btn-sell { background: var(--accent-red); }

/* LISTS */
.list-container { flex: 1; overflow-y: auto; background: rgba(0,0,0,0.2); border-radius: 8px; padding: 10px; border: 1px solid #222; }
.order-row { display: flex; justify-content: space-between; padding: 6px 10px; font-family: 'Roboto Mono', monospace; font-size: 0.85rem; border-radius: 4px; margin-bottom: 4px; }
.order-row.ask { color: var(--accent-red); background: rgba(239, 68, 68, 0.05); }
.order-row.bid { color: var(--accent-green); background: rgba(34, 197, 94, 0.05); }

.trade-row { font-size: 0.7rem; padding: 6px 0; border-bottom: 1px solid #222; color: #aaa; }
.trade-row strong { color: #fff; }

/* DIGITS */
.digits-container { position: absolute; top: 20px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 10px; z-index: 20; }
.bubbles-row { display: flex; flex-direction: row; gap: 10px; justify-content: center; }
.bubble { width: 44px; height: 44px; border-radius: 12px; background: #252b36; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.4rem; color: #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }

.logout-btn { background: transparent; border: 1px solid var(--accent-red); color: var(--accent-red); padding: 8px 18px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: 700; transition: 0.2s; }
.logout-btn:hover { background: var(--accent-red); color: white; }
.start-btn { background: var(--accent-green); color: #000; border: none; padding: 14px 28px; border-radius: 10px; cursor: pointer; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }

.game-over-modal { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.95); backdrop-filter: blur(12px); display:flex; align-items:center; justify-content:center; z-index:1000; }

/* AWARDS CSS */
.awards-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px; }
.award-card { background: rgba(255,255,255,0.05); padding: 12px; border-radius: 12px; border: 1px solid #333; text-align: center; }
.award-icon { font-size: 1.5rem; margin-bottom: 5px; }
.award-title { font-size: 0.6rem; color: var(--text-muted); text-transform: uppercase; font-weight: 800; }
.award-winner { font-size: 1rem; color: var(--accent-blue); font-weight: 800; }

.copy-badge { background: #2d3748; padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 800; cursor: pointer; transition: 0.2s; }
.copy-badge:hover { background: #4a5568; }

.status-tag { padding: 4px 10px; border-radius: 4px; font-family: 'Roboto Mono', monospace; font-weight: 800; font-size: 0.9rem; }
.status-tag.active { color: var(--accent-blue); background: rgba(59, 130, 246, 0.1); }
.status-tag.intermission { color: var(--accent-yellow); background: rgba(245, 158, 11, 0.1); }
`;

const API_BASE = window.location.hostname === "localhost" 
  ? "http://localhost:4000/api/game" 
  : "https://wildoxtails-trading-ground-backend.onrender.com/api/game";

const socket = io(window.location.hostname === "localhost" 
  ? "http://localhost:4000" 
  : "https://wildoxtails-trading-ground-backend.onrender.com");

// --- MAIN APP ---
export default function App() {
  const [player, setPlayer] = useState(() => JSON.parse(localStorage.getItem("axxela_player")));
  const [roomCode, setRoomCode] = useState(() => localStorage.getItem("axxela_room"));
  const [gameState, setGameState] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [verifying, setVerifying] = useState(!!(player && roomCode));
  const [tradeError, setTradeError] = useState("");
  const priceRef = useRef();

  // Simple Audio Feedback
  const playSound = (freq) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.1);
    } catch(e) {}
  };

  useEffect(() => {
    const verify = async () => {
      if (player && roomCode) {
        try {
          const res = await fetch(`${API_BASE}/state?roomCode=${roomCode}`);
          if (res.status === 404) handleLogout();
          else {
            const data = await res.json();
            if (!data.players?.find(p => p.id === player.id)) handleLogout();
            else { setGameState(data); socket.emit('joinRoom', roomCode); }
          }
        } catch (e) { console.error(e); }
      }
      setVerifying(false);
    };
    verify();
  }, []);

  useEffect(() => {
    const onUpdate = (data) => {
      if (data.roomCode === roomCode) {
        if (gameState && data.trades?.length > gameState.trades?.length) playSound(880);
        setGameState(data);
      }
    };
    socket.on("gameState", onUpdate);
    const ticker = setInterval(() => {
      if (gameState) {
        const target = gameState.status === 'active' ? gameState.roundEndTime : gameState.intermissionEndTime;
        if (target) setTimeLeft(Math.max(0, Math.floor((target - Date.now()) / 1000)));
      }
    }, 1000);
    return () => { socket.off("gameState", onUpdate); clearInterval(ticker); };
  }, [roomCode, gameState]);

  // Keyboard Support
  useEffect(() => {
    const handleKeys = (e) => {
      if (!player || !gameState || gameState.status !== 'active') return;
      if (e.key === 'Enter') placeOrder('buy');
      if (e.key === 'ArrowUp') { e.preventDefault(); priceRef.current.value = Number(priceRef.current.value || 0) + 1; }
      if (e.key === 'ArrowDown') { e.preventDefault(); priceRef.current.value = Math.max(0, Number(priceRef.current.value || 0) - 1); }
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [player, gameState]);

  const handleLogout = () => {
    if (player && roomCode) fetch(`${API_BASE}/leave`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ playerId: player.id, roomCode }) }).catch(() => {});
    localStorage.clear(); setPlayer(null); setRoomCode(null); setGameState(null); setVerifying(false);
  };

  const placeOrder = async (side) => {
    const price = Number(priceRef.current.value);
    if (!price || !player || !roomCode) return;
    playSound(440);
    try {
      const res = await fetch(`${API_BASE}/order`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: player.id, roomCode, price, side })
      });
      if (res.status >= 400) {
        const d = await res.json();
        setTradeError(d.error || "Rejected");
        setTimeout(() => setTradeError(""), 2000);
      } else {
        priceRef.current.value = "";
      }
    } catch (e) { setTradeError("Network Error"); }
  };

  const calculateAwards = () => {
    if (!gameState || !gameState.trades || gameState.trades.length === 0) return [];
    const stats = {};
    gameState.players.forEach(p => stats[p.id] = { trades: 0, closest: Infinity });

    gameState.trades.forEach(t => {
      if (stats[t.buyer]) stats[t.buyer].trades++;
      if (stats[t.seller]) stats[t.seller].trades++;
      const diff = Math.abs(t.price - gameState.finalSum);
      [t.buyer, t.seller].forEach(id => {
        if (stats[id] && diff < stats[id].closest) stats[id].closest = diff;
      });
    });

    const awards = [];
    const whaleId = Object.keys(stats).reduce((a, b) => stats[a].trades > stats[b].trades ? a : b);
    if (stats[whaleId].trades > 0) awards.push({ title: "The Whale", icon: "🐋", player: whaleId });
    const oracleId = Object.keys(stats).reduce((a, b) => stats[a].closest < stats[b].closest ? a : b);
    if (stats[oracleId].closest !== Infinity) awards.push({ title: "The Oracle", icon: "🔮", player: oracleId });
    return awards;
  };

  const formatTime = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

  if (verifying) return <div style={{ background: '#0f1115', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Syncing Session...</div>;

  return (
    <div className="app-root">
      <style>{styles}</style>
      <div className="top-panel">
        <span className="header-title">WILDOXTAIL'S <span style={{color:'var(--accent-blue)'}}>TRADING GROUND</span></span>
        {roomCode && (
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <span onClick={() => { navigator.clipboard.writeText(roomCode); alert("Code Copied!"); }} className="copy-badge">ROOM: <span style={{ color: 'var(--accent-blue)' }}>{roomCode} 📋</span></span>
            
            {gameState && gameState.status !== 'waiting' && (
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                {gameState.status === 'intermission' ? (
                  <span className="status-tag intermission">INTERMISSION</span>
                ) : (
                  <span className="status-tag active">ROUND {gameState.round}</span>
                )}
                <span style={{ fontFamily: 'Roboto Mono', color: 'var(--accent-blue)', fontWeight: 800 }}>{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>
        )}
        {player && <button onClick={handleLogout} className="logout-btn">LEAVE</button>}
      </div>

      <div className="game-container">
        {!player ? (
          <div style={{ margin: 'auto' }}><JoinScreen onRegistered={(p, code) => { setPlayer(p); setRoomCode(code); localStorage.setItem("axxela_player", JSON.stringify(p)); localStorage.setItem("axxela_room", code); socket.emit('joinRoom', code); }} /></div>
        ) : !gameState ? (
          <div style={{ margin: 'auto', textAlign: 'center', color: '#9ca3af' }}>Waiting for room data...</div>
        ) : (
          <>
            <div className="table-area">
              <div className="digits-container">
                <span className="panel-header"></span>
                <div className="bubbles-row">
                  {gameState.revealedDigits.map((d, i) => <div key={i} className="bubble">{d}</div>)}
                  {Array(6 - gameState.revealedDigits.length).fill(0).map((_, i) => <div key={i} className="bubble" style={{ opacity: 0.1 }}>?</div>)}
                </div>
              </div>
              <div className="poker-table">
                <div className="table-center-content">
                  {gameState.players?.find(p => p.id === player.id)?.isHost && gameState.status === 'waiting' && (
                    <button onClick={() => fetch(`${API_BASE}/start`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ roomCode }) })} className="start-btn">Start Game</button>
                  )}
                  {gameState.status !== 'waiting' && (
                    <div style={{opacity: 0.5}}>
                        <div style={{fontSize:'0.7rem', color:'var(--text-muted)', marginBottom:5, letterSpacing:1}}>MARKET STATUS</div>
                        <div style={{fontSize:'1.8rem', fontWeight:800, color: gameState.status === 'active' ? 'var(--accent-blue)' : 'var(--accent-yellow)'}}>
                            {gameState.status === 'active' ? gameState.status.toUpperCase() : 'CLOSED'}
                        </div>
                    </div>
                  )}  
                </div>
                {Array(10).fill(null).map((_, i) => {
                  const s = gameState.players[i];
                  return (
                    <div key={i} className={`player-card seat-${i} ${s?.id === player.id ? 'self' : ''} ${!s ? 'empty' : ''}`}>
                      <div className="p-name">{s ? s.id : ''}</div>
                      {s && <div className="p-stats">Pos: <span className="stat-val">{s.openPosition}</span><br />PnL: <span style={{ color: s.pnl >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>{s.pnl}</span></div>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="right-panel">
              <div>
                <div className="panel-header">Place Order</div>
                <input type="number" className="price-input" ref={priceRef} placeholder="00" autoFocus />
                <div className="trade-error">{tradeError}</div>
                <div className="btn-row">
                  <button className="btn-trade btn-buy" onClick={() => placeOrder('buy')}>BUY</button>
                  <button className="btn-trade btn-sell" onClick={() => placeOrder('sell')}>SELL</button>
                </div>
              </div>
              <div className="book-container">
                <div style={{flex:1}}><div className="panel-header" style={{color:'var(--accent-red)'}}>Asks</div>
                  <div className="list-container">{(gameState.sellOrders || []).sort((a,b)=>a.price-b.price).map(o => <div key={o.id} className="order-row ask"><span>{o.price}</span><span>{o.playerId}</span></div>)}</div>
                </div>
                <div style={{flex:1}}><div className="panel-header" style={{color:'var(--accent-green)'}}>Bids</div>
                  <div className="list-container">{(gameState.buyOrders || []).sort((a,b)=>b.price-a.price).map(o => <div key={o.id} className="order-row bid"><span>{o.price}</span><span>{o.playerId}</span></div>)}</div>
                </div>
                <div style={{height: 120}}><div className="panel-header">Trade Log</div>
                  <div className="list-container">{(gameState.trades || []).map(t => <div key={t.id} className="trade-row">[{t.timestamp || 'now'}] <strong>{t.buyer}</strong> bought from <strong>{t.seller}</strong> @ {t.price}</div>)}</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {gameState?.status === 'ended' && (
        <div className="game-over-modal">
          <div style={{ background: '#161b22', padding: 50, borderRadius: 32, textAlign: 'center', border: '1px solid #30363d', minWidth: 400, boxShadow: '0 0 100px #000' }}>
            <h1 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', letterSpacing: 3 }}>FINAL TRUE SUM</h1>
            <div style={{ fontSize: '6rem', color: 'var(--accent-green)', fontWeight: 800 }}>{gameState.finalSum}</div>
            <div className="awards-grid">
              {calculateAwards().map((a, i) => (
                <div key={i} className="award-card">
                  <div className="award-icon">{a.icon}</div>
                  <div className="award-title">{a.title}</div>
                  <div className="award-winner">{a.player}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 25, textAlign: 'left', maxHeight: 200, overflowY: 'auto' }}>
              <div className="panel-header" style={{ borderBottom: '1px solid #333', paddingBottom: 10 }}>Leaderboard</div>
              {gameState.players.sort((a, b) => b.pnl - a.pnl).map((p, idx) => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #222' }}>
                  <span style={{fontWeight: p.id === player?.id ? 800 : 400}}>#{idx + 1} {p.id}</span>
                  <span style={{ color: p.pnl >= 0 ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 800 }}>{p.pnl > 0 ? '+' : ''}{p.pnl}</span>
                </div>
              ))}
            </div>
            {gameState.players?.find(p => p.id === player.id)?.isHost && (
              <button onClick={() => fetch(`${API_BASE}/start`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ roomCode }) })} style={{ marginTop: 30, width: '100%', padding: 15, background: 'var(--accent-blue)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 800, cursor: 'pointer' }}>RESTART</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function JoinScreen({ onRegistered }) {
  const [mode, setMode] = useState("join");
  const [initials, setInitials] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const submit = async (e) => {
    e.preventDefault(); setError("");
    try {
      let activeCode = code;
      if (mode === 'create') {
        const r1 = await fetch(`${API_BASE}/create`, { method: "POST" });
        const d1 = await r1.json();
        activeCode = d1.roomCode;
      }
      const r2 = await fetch(`${API_BASE}/join`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initials, roomCode: activeCode })
      });
      const d2 = await r2.json();
      if (d2.error) setError(d2.error); else onRegistered(d2.player, activeCode);
    } catch (err) { setError("Server Error"); }
  };
  return (
    <div style={{ background: '#181b21', padding: 40, borderRadius: 24, border: '1px solid #2d3748', width: 320, textAlign: 'center' }}>
      <div style={{ display: 'flex', marginBottom: 25, background: '#0f1115', borderRadius: 12, padding: 4 }}>
        <button onClick={() => setMode('join')} style={{ flex: 1, padding: 12, borderRadius: 10, border: 'none', cursor: 'pointer', background: mode === 'join' ? '#3b82f6' : 'transparent', color: 'white', fontWeight: 800 }}>JOIN</button>
        <button onClick={() => setMode('create')} style={{ flex: 1, padding: 12, borderRadius: 10, border: 'none', cursor: 'pointer', background: mode === 'create' ? '#3b82f6' : 'transparent', color: 'white', fontWeight: 800 }}>CREATE</button>
      </div>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        {mode === 'join' && <input style={{ padding: 14, background: '#0f1115', border: '1px solid #333', color: 'white', textAlign:'center', borderRadius: 10 }} placeholder="ROOM CODE" value={code} onChange={e => setCode(e.target.value.toUpperCase())} maxLength={4} required />}
        <input style={{ padding: 14, background: '#0f1115', border: '1px solid #333', color: 'white', textAlign:'center', borderRadius: 10 }} placeholder="INITIALS" value={initials} onChange={e => setInitials(e.target.value.toUpperCase())} maxLength={3} required />
        <button style={{ padding: 16, background: mode === 'join' ? '#22c55e' : '#3b82f6', color: '#000', border: 'none', borderRadius: 10, fontWeight: 800, cursor: 'pointer' }}>{mode.toUpperCase()}</button>
      </form>
      {error && <div style={{ color: 'var(--accent-red)', marginTop: 15 }}>{error}</div>}
    </div>
  );
}

function AdminTools({ roomCode }) {
  const [open, setOpen] = useState(false);
  const act = (ep) => fetch(`${API_BASE}${ep}`, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ roomCode }) });
  if (!open) return <button onClick={()=>setOpen(true)} style={{ position: 'fixed', bottom: 30, right: 30, background: 'rgba(255,255,255,0.08)', border: '1px solid #444', borderRadius: '50%', width: 50, height: 50, cursor: 'pointer', fontSize: '1.4rem' }}>⚙️</button>;
  return (
    <div style={{ position: 'fixed', bottom: 30, right: 30, background: '#1c2128', border: '1px solid #444', padding: 25, borderRadius: 20, zIndex: 3000 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}><strong>HOST OVERRIDE</strong><button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer' }}>×</button></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button onClick={()=>act('/start')} style={{ background: '#22c55e', border: 'none', padding: 14, borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}>RESTART SESSION</button>
        <button onClick={()=>act('/admin/advance')} style={{ background: '#ef4444', color: 'white', border: 'none', padding: 14, borderRadius: 8, cursor: 'pointer' }}>FORCE NEXT ROUND</button>
      </div>
    </div>
  );
}
