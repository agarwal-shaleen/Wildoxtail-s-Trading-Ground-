const { games } = require("../data/gameData");
const { v4: uuid } = require("uuid");

const ROUND_DURATION_SEC = 90;
const INTERMISSION_SEC = 10;
const MAX_POSITION = 2; 

// --- HELPER: BROADCAST ---
function broadcastGameState(roomCode) {
    const game = games[roomCode];
    if (!game) return;
    global.io.to(roomCode).emit("gameState", {
        ...game.gameState,
        players: game.players,
        roomCode
    });
}

// --- ENGINE ---
setInterval(() => {
    const now = Date.now();
    Object.keys(games).forEach(code => {
        const g = games[code];
        if (g.gameState.status === "active" && now >= g.gameState.roundEndTime) {
            handleEnd(code);
        } else if (g.gameState.status === "intermission" && now >= g.gameState.intermissionEndTime) {
            startNext(code);
        }
    });
}, 1000);

// --- API ---

function createGame(req, res) {
    const roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    games[roomCode] = {
        gameState: {
            status: "waiting", round: 1, totalRounds: 6, revealedDigits: [],
            roundEndTime: null, intermissionEndTime: null,
            buyOrders: [], sellOrders: [], trades: [], marketPrice: 0, finalSum: null
        },
        players: [],
        MAX_PLAYERS: 10,
        hostId: null
    };
    res.json({ roomCode });
}

function joinGame(req, res) {
    const { initials, roomCode } = req.body;
    const code = roomCode?.toUpperCase();
    const game = games[code];
    if (!game) return res.status(404).json({ error: "Room not found" });

    const id = initials?.toUpperCase().slice(0, 3);
    let player = game.players.find(p => p.id === id);

    if (!player) {
        if (game.players.length >= game.MAX_PLAYERS) return res.status(400).json({ error: "Room Full" });
        const isHost = game.players.length === 0;
        if (isHost) game.hostId = id;

        player = { 
            id, 
            openPosition: 0, 
            realizedPnl: 0, 
            pnl: 0, 
            lots: [], // Restored lots tracking
            isHost 
        };
        game.players.push(player);
    }

    broadcastGameState(code);
    res.json({ player, roomCode: code });
}

function getGameState(req, res) {
    const { roomCode } = req.query;
    const game = games[roomCode?.toUpperCase()];
    if (!game) return res.status(404).json({ error: "Room not found" });
    res.json({ ...game.gameState, players: game.players, roomCode });
}

function placeOrder(req, res) {
    const { playerId, price, side, roomCode } = req.body;
    const game = games[roomCode];
    if (!game || game.gameState.status !== "active") return res.status(400).json({ error: "Market Closed" });

    const player = game.players.find(p => p.id === playerId);
    if (!player) return res.status(400).json({ error: "Player not found" });

    const isBuy = side === 'buy';
    
    if (Math.abs(player.openPosition + (isBuy ? 1 : -1)) > MAX_POSITION) {
        return res.status(400).json({ error: `Max Position Limit reached (${MAX_POSITION})` });
    }

    const oppBook = isBuy ? game.gameState.sellOrders : game.gameState.buyOrders;
    oppBook.sort((a, b) => isBuy ? a.price - b.price : b.price - a.price);

    const matchIdx = oppBook.findIndex(o => isBuy ? o.price <= price : o.price >= price);

    if (matchIdx !== -1) {
        const match = oppBook[matchIdx];
        const maker = game.players.find(p => p.id === match.playerId);
        const execPrice = match.price;

        updatePlayerLots(player, side, execPrice);
        updatePlayerLots(maker, isBuy ? 'sell' : 'buy', execPrice);

        oppBook.splice(matchIdx, 1);
        game.gameState.marketPrice = execPrice;

        if(player !== maker){
            game.gameState.trades.unshift({ 
                id: uuid(), 
                price: execPrice, 
                buyer: isBuy ? playerId : match.playerId, 
                seller: isBuy ? match.playerId : playerId,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            });
        }
    } else{
        const myBook = isBuy ? game.gameState.buyOrders : game.gameState.sellOrders;
        myBook.push({ id: uuid(), playerId, price, side });
    }

    broadcastGameState(roomCode);
    res.json({ success: true });
}

function updatePlayerLots(p, side, price) {
    if (side === 'buy') {
        if (p.openPosition < 0) {
            const lotIdx = p.lots.findIndex(l => l.side === 'short');
            if (lotIdx !== -1) {
                const closedLot = p.lots.splice(lotIdx, 1)[0];
                p.realizedPnl += (closedLot.price - price);
            }
        } else {
            p.lots.push({ side: 'long', price });
        }
        p.openPosition++;
    } else {
        if (p.openPosition > 0) {
            const lotIdx = p.lots.findIndex(l => l.side === 'long');
            if (lotIdx !== -1) {
                const closedLot = p.lots.splice(lotIdx, 1)[0];
                p.realizedPnl += (price - closedLot.price);
            }
        } else {
            p.lots.push({ side: 'short', price });
        }
        p.openPosition--;
    }
    p.pnl = p.realizedPnl; 
}

function handleEnd(code) {
    const g = games[code];
    g.gameState.revealedDigits.push(Math.floor(5 + Math.random()*5));
    if (g.gameState.round >= g.gameState.totalRounds) {
        g.gameState.status = "ended";
        settleGame(code);
    } else {
        g.gameState.status = "intermission";
        g.gameState.intermissionEndTime = Date.now() + (INTERMISSION_SEC * 1000);
    }
    broadcastGameState(code);
}

function settleGame(code) {
    const g = games[code];
    const sum = g.gameState.revealedDigits.reduce((a, b) => a + b, 0);
    g.gameState.finalSum = sum;
    g.players.forEach(p => {
        let total = p.realizedPnl;
        // Calculate PnL for remaining open lots against the True Value (Sum)
        p.lots.forEach(l => {
            if (l.side === 'long') total += (sum - l.price);
            else total += (l.price - sum);
        });
        p.pnl = total;
        p.lots = []; // Clear lots after settlement
        p.openPosition = 0;
    });
}

function startGame(req, res) {
    const { roomCode } = req.body;
    const game = games[roomCode];
    if (!game) return res.status(404).json({ error: "No room" });
    game.gameState.status = "active";
    game.gameState.round = 1;
    game.gameState.revealedDigits = [];
    game.gameState.buyOrders = [];
    game.gameState.sellOrders = [];
    game.gameState.trades = [];
    game.gameState.roundEndTime = Date.now() + (ROUND_DURATION_SEC * 1000);
    game.players.forEach(p => { 
        p.openPosition = 0; 
        p.pnl = 0; 
        p.realizedPnl = 0; 
        p.lots = []; 
    });
    broadcastGameState(roomCode);
    res.json({ success: true });
}

function leaveGame(req, res) {
    const { playerId, roomCode } = req.body;
    const game = games[roomCode];
    if (game) {
        game.players = game.players.filter(p => p.id !== playerId);
        game.gameState.sellOrders = game.gameState.sellOrders.filter(p => p.playerId !== playerId); 
        game.gameState.buyOrders = game.gameState.buyOrders.filter(p => p.playerId !== playerId); 
        if (game.hostId === playerId && game.players.length > 0) {
            game.hostId = game.players[0].id;
            game.players[0].isHost = true;
        }
        broadcastGameState(roomCode);
    }
    res.json({ success: true });
}

function startNext(code) {
    const g = games[code];
    g.gameState.round++;
    g.gameState.status = "active";
    g.gameState.roundEndTime = Date.now() + (ROUND_DURATION_SEC * 1000);
    broadcastGameState(code);
}

module.exports = { createGame, joinGame, placeOrder, getGameState, startGame, leaveGame, resetGame: startGame, forceNextStage: (req,res)=>res.json({ok:1}), verifyAdmin:(req,res)=>res.json({success:true}) };
