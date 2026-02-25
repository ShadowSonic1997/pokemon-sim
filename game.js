// 1. Data Structures
let field = { weather: 'Rain', turns: 5 };
let playerTeam = [];
let opponentTeam = [{ name: 'Golem', hp: 100, maxHp: 100, speed: 45, type: ['Rock', 'Ground'], moves: [{name: 'Earthquake', power: 100}] }];
let activeIdx = 0;
let oppIdx = 0;

// 2. Showdown Import Logic
const teamData = `Articuno @ Leftovers
Ability: Pressure
- Ice Beam
- Hurricane
- Substitute
- Roost

Ludicolo @ Life Orb
Ability: Swift Swim
- Surf
- Giga Drain
- Ice Beam
- Rain Dance`;

function importTeam(str) {
    // Uses @pkmn/sets globally from index.html
    const sets = window.pkmn.sets.Sets.importTeam(str);
    return sets.map(s => ({
        name: s.name,
        hp: 100, maxHp: 100,
        speed: 100, // In a real app, calculate stats based on EVs/IVs
        ability: s.ability,
        moves: s.moves.map(m => ({ name: m, power: 80 })) // Placeholder power
    }));
}

playerTeam = importTeam(teamData);

// 3. Battle Logic with Rain & Swift Swim
function calculateDamage(attacker, defender, move) {
    let multiplier = 1;
    // Swift Swim Logic
    let atkSpeed = attacker.speed;
    if (field.weather === 'Rain' && attacker.ability === 'Swift Swim') atkSpeed *= 2;

    // Rain Damage Multiplier
    if (field.weather === 'Rain' && move.name === 'Surf') multiplier *= 1.5;
    
    return Math.floor(move.power * multiplier * (Math.random() * (1 - 0.85) + 0.85));
}

// 4. AI Logic (Heuristic: Choose Highest Damage)
function aiTurn() {
    const opp = opponentTeam[oppIdx];
    const player = playerTeam[activeIdx];
    
    // AI picks move (simplified)
    const damage = calculateDamage(opp, player, opp.moves[0]);
    player.hp = Math.max(0, player.hp - damage);
    updateUI(`Opponent ${opp.name} used ${opp.moves[0].name} for ${damage} damage!`);
}

function playerTurn(moveIdx) {
    const player = playerTeam[activeIdx];
    const opp = opponentTeam[oppIdx];
    const move = player.moves[moveIdx];
    
    const damage = calculateDamage(player, opp, move);
    opp.hp = Math.max(0, opp.hp - damage);
    updateUI(`You used ${move.name} for ${damage} damage!`);
    
    if (opp.hp > 0) setTimeout(aiTurn, 1000);
}

function updateUI(msg) {
    document.getElementById('log').innerHTML += `<br>${msg}`;
    document.getElementById('player-hp-fill').style.width = `${playerTeam[activeIdx].hp}%`;
    document.getElementById('opp-hp-fill').style.width = `${opponentTeam[oppIdx].hp}%`;
}

// Initialize Moves
playerTeam[activeIdx].moves.forEach((m, i) => {
    const btn = document.createElement('button');
    btn.innerText = m.name;
    btn.onclick = () => playerTurn(i);
    document.getElementById('move-buttons').appendChild(btn);
});
