const log = document.getElementById('battle-log');
const moveGrid = document.getElementById('move-grid');

let state = {
    weather: 'Rain',
    player: { name: 'Articuno', hp: 100, ability: 'Pressure', moves: ['Ice Beam', 'Hurricane', 'Roost', 'Substitute'] },
    enemy: { name: 'Garchomp', hp: 100, moves: ['Earthquake'] }
};

function writeLog(text) {
    const entry = document.createElement('div');
    entry.innerText = `> ${text}`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

async function startBattle() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-ui').classList.remove('hidden');
    writeLog("The battle has begun!");
    writeLog("Rain is falling heavily.");

    // Fetch real images from PokeAPI
    const pData = await fetch('https://pokeapi.co').then(r => r.json());
    const eData = await fetch('https://pokeapi.co').then(r => r.json());
    
    document.getElementById('player-sprite').src = pData.sprites.back_default;
    document.getElementById('opp-sprite').src = eData.sprites.front_default;

    renderMoves();
}

function renderMoves() {
    moveGrid.innerHTML = '';
    state.player.moves.forEach(m => {
        const b = document.createElement('button');
        b.innerText = m;
        b.onclick = () => handleTurn(m);
        moveGrid.appendChild(b);
    });
}

function handleTurn(move) {
    // Player Turn
    writeLog(`Articuno used ${move}!`);
    let damage = 20; 
    if (state.weather === 'Rain' && move === 'Hurricane') writeLog("Hurricane never misses in Rain!");
    
    state.enemy.hp = Math.max(0, state.enemy.hp - damage);
    document.getElementById('opp-hp').style.width = state.enemy.hp + "%";

    if (state.enemy.hp <= 0) {
        writeLog("Enemy Garchomp fainted!");
        return;
    }

    // AI Turn
    setTimeout(() => {
        writeLog("Enemy Garchomp used Earthquake!");
        state.player.hp = Math.max(0, state.player.hp - 15);
        document.getElementById('p-hp').style.width = state.player.hp + "%";
        if (state.player.hp <= 0) writeLog("Articuno fainted!");
    }, 800);
}

document.getElementById('start-btn').onclick = startBattle;
