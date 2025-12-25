import PlayerSeat from "./PlayerSeat";
import OrderBook from "./OrderBook";

export default function GameTable({ player, gameState, onPlaceOrder, onRefresh }) {
  const { revealedDigits = [], round, players = [] } = gameState;

  // --- CRITICAL FIX: Ghost Player Check ---
  // If the server restarted, my ID might not exist in the 'players' array anymore.
  const amIAlive = players.find(p => p.id === player.id);
  
  if (!amIAlive) {
    return (
      <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', width:'100%', gap:'20px'}}>
        <h2 style={{color: '#da3633', margin:0}}>Session Expired</h2>
        <p style={{color: '#8b949e'}}>The game server was restarted.</p>
        <p style={{color: '#8b949e'}}>Please click <strong>Logout / Reset</strong> in the top right corner.</p>
      </div>
    );
  }

  // --- SEAT MAPPING ---
  // Map players to 6 fixed seats.
  const seats = Array(6).fill(null);
  players.slice(0, 6).forEach((p, idx) => {
    seats[idx] = p;
  });

  return (
    <>
      {/* LEFT AREA: TABLE & DIGITS */}
      <div className="table-area">
        
        {/* Floating Digits Display */}
        <div style={{position:'absolute', top:'20px', display:'flex', flexDirection:'column', alignItems:'center', gap:'10px'}}>
          <span style={{color:'#8b949e', fontSize:'0.8rem', textTransform:'uppercase', letterSpacing:'1px'}}>Sum Prediction</span>
          <div className="digits-display">
            <div className="digits-bubbles">
              {revealedDigits.length === 0 ? (
                <span className="digit-bubble empty">?</span>
              ) : (
                revealedDigits.map((d, i) => (
                  <span key={i} className="digit-bubble">
                    {d}
                  </span>
                ))
              )}
               {/* Show placeholders for unrevealed digits (total 6) */}
               {Array(6 - revealedDigits.length).fill(0).map((_, i) => (
                  <span key={`placeholder-${i}`} className="digit-bubble empty" style={{opacity:0.3}}>?</span>
               ))}
            </div>
          </div>
        </div>

        {/* The Circle Table */}
        <div className="table-circle">
          <div className="center-label">
            MARKET PRICE<br/>
            {/* If you have a market price in state, show it, otherwise show '?' */}
            <span>{gameState.marketPrice || "?"}</span>
          </div>

          {seats.map((seatPlayer, index) => (
            <PlayerSeat
              key={index}
              seatIndex={index}
              player={seatPlayer}
              isSelf={seatPlayer && seatPlayer.id === player.id}
              onPlaceOrder={onPlaceOrder}
              selfId={player.id}
            />
          ))}
        </div>
      </div>

      {/* RIGHT AREA: ORDER BOOK */}
      <div className="right-panel">
        <OrderBook gameState={gameState} selfId={player.id} />
      </div>
    </>
  );
}