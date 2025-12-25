export default function OrderBook({ gameState, selfId }) {
  if (!gameState) return null;

  const buyOrders = Array.isArray(gameState.buyOrders)
    ? [...gameState.buyOrders].sort((a, b) => b.price - a.price)
    : [];
  const sellOrders = Array.isArray(gameState.sellOrders)
    ? [...gameState.sellOrders].sort((a, b) => a.price - b.price)
    : [];

  return (
    <div className="orderbook-panel">
      <h3>Order Book</h3>

      <div className="order-section">
        <h4>Buy Orders</h4>
        {buyOrders.length === 0 && <div>No buy orders</div>}
        {buyOrders.map(order => (
          <div
            key={order.id}
            className={`order-row ${order.playerId === selfId ? "self" : ""}`}
          >
            <span>{order.playerId}</span>
            <span>{order.price}</span>
          </div>
        ))}
      </div>

      <div className="order-section">
        <h4>Sell Orders</h4>
        {sellOrders.length === 0 && <div>No sell orders</div>}
        {sellOrders.map(order => (
          <div
            key={order.id}
            className={`order-row ${order.playerId === selfId ? "self" : ""}`}
          >
            <span>{order.playerId}</span>
            <span>{order.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
