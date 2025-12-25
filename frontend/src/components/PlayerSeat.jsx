import { useState } from "react";

const seatPositions = [
  "top",            // 0
  "top-right",      // 1
  "bottom-right",   // 2
  "bottom",         // 3
  "bottom-left",    // 4
  "top-left"        // 5
];

export default function PlayerSeat({
  seatIndex,
  player,
  isSelf,
  onPlaceOrder,
  selfId
}) {
  const [price, setPrice] = useState("");
  const [side, setSide] = useState("buy");   // NEW: buy / sell

  // If no player in this seat
  if (!player) {
    return (
      <div className={`player-seat seat-${seatPositions[seatIndex]} empty`}>
        <div className="player-label">Empty</div>
      </div>
    );
  }

  const showControls = isSelf;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!price) return;

    onPlaceOrder({
      price: Number(price),
      side
    });

    setPrice("");
  };

  return (
    <div className={`player-seat seat-${seatPositions[seatIndex]} ${isSelf ? "self" : ""}`}>
      
      {/* Player name */}
      <div className="player-label">{player.id}</div>

      {/* Stats */}
      <div className="player-stats">
        <div>Open pos: {player.openPosition}</div>
        <div>PnL: {player.pnl}</div>
      </div>

      {/* Only your own seat gets order controls */}
      {showControls && (
        <form className="trade-form" onSubmit={handleSubmit}>
          
          {/* Price input */}
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          {/* BUY / SELL toggle */}
          <div className="action-buttons">
            <button
              type="button"
              className={side === "buy" ? "action-btn active" : "action-btn"}
              onClick={() => setSide("buy")}
            >
              Buy
            </button>

            <button
              type="button"
              className={side === "sell" ? "action-btn active sell" : "action-btn sell"}
              onClick={() => setSide("sell")}
            >
              Sell
            </button>
          </div>

          {/* Submit */}
          <button type="submit" className="place-order-btn">
            Place Order
          </button>
        </form>
      )}
    </div>
  );
}
