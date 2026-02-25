const logElement = document.getElementById('log');
const moveContainer = document.getElementById('move-buttons');

let field = { weather: 'Rain', turns: 8 }; // Damp Rock extends rain
let playerTeam = [];
let opponentActive = { name: 'Garchomp', hp: 100, maxHp: 100, speed: 102, moves: ['Earthquake', 'Dragon Claw'] };

const teamString = `Articuno @ Leftovers  
Ability: Pressure  
- Ice Beam  
- Hurricane  
- Substitute  
- Roost  

Volbeat (M) @ Damp Rock  
Ability: Prankster  
- Tail Glow  
- Baton Pass  
- Encore  
- Rain Dance`;

// 1. Improved Parser for your specific team
function parseTeam(str) {
    return str.split('\n\n').map(block => {
        const lines = block.split('\n');
        const name = lines[0].split('@')[0].trim();
        const ability = lines.find(l => l.includes('Ability'))?.split(': ')[1] || 'None';
        const moves = lines.filter(l => l.startsWith('- ')).map(l => l.replace('- ', ''));
        return { name, ability, hp: 100, maxHp: 100, moves };
    });
}

// 2. Fetch Sprites from PokeAPI
async function updateSprites() {
    const p1 = playerTeam[0].name.toLowerCase().split(' ')[0];
    const p2 = opponentActive.name.toLowerCase();
    
    const p1Data = await fetch(`https://pokeapi.co{p1}`).then(r => r.json());
    const p2Data = await fetch(`https://pokeapi.co{p2}`).then(r => r.json());
    
    document.getElementById('player-sprite').src = p1Data.sprites.back_default;
    document.getElementById('opp-sprite').src = p2Data.sprites.front_default;
    document.getElementById('player-name').innerText = playerTeam[0].name;
    document.getElementById('opp-name').innerText = opponentActive.name;
}

// 3. Battle Mechanics (Prankster & Swift Swim)
function executeMove(moveName, isPlayer) {
    let priority = 0;
    const attacker = isPlayer ? playerTeam[0] : opponentActive;
    const defender = isPlayer ? opponentActive : playerTeam[0];

    // Ability: Prankster logic
    if (isPlayer && attacker.ability === 'Prankster' && moveName === 'Rain Dance') {
        priority = 1; 
        updateLog("Prankster activated! Priority +1");
    }

    // Damage Calculation (Simulated Showdown style)
    let damage = 25; 
    if (field.weather === 'Rain' && moveName === 'Surf') damage *= 1.5;
    
    defender.hp = Math.max(0, defender.hp - damage);
    updateLog(`${attacker.name} used ${moveName}!`);
    refreshUI();
    
    if (isPlayer && defender.hp > 0) {
        setTimeout(() => executeMove(opponentActive.moves[0], false), 1000);
    }
}

function updateLog(msg) {
    logElement.innerHTML += `<div>${msg}</div>`;
    logElement.scrollTop = logElement.scrollHeight;
}

function refreshUI() {
    document.getElementById('player-hp-fill').style.width = playerTeam[0].hp + "%";
    document.getElementById('opp-hp-fill').style.width = opponentActive.hp + "%";
}

// 4. Start Game
async function init() {
    playerTeam = parseTeam(teamString);
    await updateSprites();
    
    playerTeam[0].moves.forEach(move => {
        const btn = document.createElement('button');
        btn.innerText = move;
        btn.onclick = () => executeMove(move, true);
        moveContainer.appendChild(btn);
    });
}

init();
