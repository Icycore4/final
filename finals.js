// FULL UPDATED CODE BELOW

let hand = []; 
let suitsAll = ['hearts', 'diamonds', 'clubs', 'spades'];
let ranksAll = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
let suits = suitsAll;
let ranks = ranksAll;

let selectedDeckType = 'standard';

let suitSymbols =
{
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠'
};

let deckOptions = [
  { name: 'Standard Deck', suits: suitsAll, ranks: ranksAll },
  { name: 'Cut Deck (No midranks)', suits: suitsAll, ranks: [2, 3, 4, 5, 'J', 'Q', 'K', 'A'] },
  { name: 'Dechrome Deck (2 suits)', suits: ['hearts', 'spades'], ranks: ranksAll },
  { name: 'Valence Deck (???)', suits: ['hearts'], ranks: [2, 3, 4, 5, 6, 7] }
];

let score = 0;
let targetScore = 500;
let lastHandResult = '';
let lastHandPoints = 0;
let handEvaluated = false;
let handsPlayed = 0;
let maxHands = 6;
let gamePhase = 'menu'; // Initial phase now set to 'menu'
let win = false;
let rerollsLeft = 10;
let rollups = 0;
let scoreMultiplier = 1.0;
let money = 0;
let scalae = 1;
let num = 0;
let numCap = 6;
let jex = 0;

let deck = [];
let cardsLeft = 0;
let selectedCardIndex = -1;
let showHandValues = false;
let roundNumber = 1;
let l1 = 0.63
let l2 = 0.88
let l3 = 0.95
let l4 = 0.99




let mysteryCards = []; // now Jokers!

let shopItems = [
  {
    name: "Buy 3 Rerolls",
    cost: 500,
    action: () => { rollups += 3; },
  },
  {
    name: "boost joker luck",
    cost: 400,
    action: () => { 
    l1-= 0.045
    l2-= 0.04
    l3-= 0.025
    l4-=0.015
    
  },
  },
  {
    name: "Buy Mystery Joker",
    cost: 1000,
    action: () => { 
      if(jex<numCap)
      {
      mysteryCards.push(generateJoker());
      jex+=1
      if(jex < 6)
      {
        mysteryCards.push(generateJoker());
        jex+=1
      }
      }
    },
  },
  {
    name: "Increase Max Jokers",
    cost: 2500,
    action: () => { numCap++; },
  }
];


function setup() {
  createCanvas(1250, 600);
  gamePhase = 'menu'; // Start in menu
}

function draw() {
  background(30, 120, 70);

  if (gamePhase === 'menu') {
    drawMainMenu();
  } else if (gamePhase === 'playing') {
    drawGame();
  } else if (gamePhase === 'shop') {
    drawShop();
  } else if (gamePhase === 'gameover') {
    drawGameOver();
  }
}


function drawMainMenu() {
  background(50);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(36);
  text('Balala 2- Select a Deck', width / 2, 60);

  textSize(24);
  for (let i = 0; i < deckOptions.length; i++) {
    let x = width / 2 - 150;
    let y = 125 + i * 100;
    let w = 300;
    let h = 65;
    let hovered = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;

    fill(hovered ? '#77cc77' : '#55aa55');
    rect(x, y, w, h, 15);
    fill(255);
    text(deckOptions[i].name, width / 2, y + h / 2);
  }
}



function drawGame() {
  fill(255);
  textSize(24);
  textAlign(LEFT, TOP);
  text(`Target Score: ${targetScore}`, 20, 30);
  text(`Current Score: ${score}`, 20, 60);
  text(`Hands Played: ${handsPlayed}/${maxHands}`, 20, 90);
  text(`Rerolls Left: ${rerollsLeft}`, 20, 120);
  text(`Cards Left: ${cardsLeft}`, width - 200, 150);
text(`Round: ${roundNumber}`, width - 200,60);
  text(`Joker slots: ${numCap}`, width - 200, 90);
  text(`Jokers: ${jex}`, width - 200, 120);
  text(`Money: $${money}`, width - 200, 30);

  for (let i = 0; i < hand.length; i++) {
    if (i === selectedCardIndex) {
      strokeWeight(4);
      stroke('yellow');
    } else {
      strokeWeight(1);
      stroke(0);
    }
    drawCard(hand[i], 80 + i * 180, 150);
  }

  for (let i = 0; i < mysteryCards.length; i++) {
    drawMysteryCard(80 + i * 140, 350, mysteryCards[i]);
  }

  if (lastHandResult) {
    textSize(28);
    fill(255);
    textAlign(LEFT, TOP);
    text(lastHandResult, 20, height - 80);
    text(`+${lastHandPoints} points`, 20, height - 50);
  }

  drawScoreButton();
  drawShowValuesButton();

  if (showHandValues) {
    drawHandValuesPopup();
  }
}

function drawShop() {
  background(30);
  fill(255);
  textAlign(CENTER, TOP);
  textSize(36);
  text('SHOP', width / 2, 40);

  textSize(24);
  text(`Money: $${money}`, width / 2, 100);

  let startY = 180;
  let buttonWidth = 400;
  let buttonHeight = 60;
  let spacingY = 100;
  let spacingX = 450;

  for (let i = 0; i < shopItems.length; i++) {
    // Arrange into 2 columns
    let col = i % 2;
    let row = Math.floor(i / 2);

    let x = width / 2 - spacingX/2 + col * spacingX;
    x -=200
    let y = startY + row * spacingY;

    let hovered = mouseX > x && mouseX < x + buttonWidth && mouseY > y && mouseY < y + buttonHeight;
    let canAfford = money >= shopItems[i].cost;

    fill(hovered ? (canAfford ? '#88cc88' : '#cc8888') : (canAfford ? '#55aa55' : '#aa5555'));
    rect(x, y, buttonWidth, buttonHeight, 15);

    fill(255);
    textAlign(CENTER, CENTER);
    text(`${shopItems[i].name} - $${shopItems[i].cost}`, x + buttonWidth / 2, y + buttonHeight / 2);
  }

  // Draw Continue button
  let continueY = startY + Math.ceil(shopItems.length / 2) * spacingY;
  fill(mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > continueY && mouseY < continueY + 50 ? '#8888cc' : '#5555aa');
  rect(width / 2 - 100, continueY, 200, 50, 10);

  fill(255);
  textSize(24);
  text('Continue', width / 2, continueY + 25);
}





function drawGameOver() {
  background(20, 20, 20, 220);
  textAlign(CENTER, CENTER);
  textSize(48);
  fill(win ? 'gold' : 'red');
  text(win ? 'YOU WIN!' : 'YOU LOSE!', width / 2, height / 2 - 100);

  textSize(24);
  fill(255);
  text(`Final Score: ${score}`, width / 2, height / 2);
  text(`Total Money: $${money}`, width / 2, height / 2 + 40);
  text('Click to Restart', width / 2, height / 2 + 80);
}

function mousePressed() {

  if (gamePhase === 'menu') {
    handleMenuClick();
    return;
  }
  
  if (gamePhase === 'gameover') {
   startNewGame();
    return;
  }

  if (gamePhase === 'playing') {
    // Score Hand Button
    if (mouseY > height - 50 && mouseY < height - 20) {
      if (mouseX > 20 && mouseX < 220) {
        scoreHand();
        return;
      }
      if (mouseX > width - 220 && mouseX < width - 20) {
        showHandValues = !showHandValues;
        return;
      }
    }

    // Instant reroll when clicking a card
    for (let i = 0; i < hand.length; i++) {
      let x = 80 + i * 180;
      if (mouseX > x && mouseX < x + 120 && mouseY > 150 && mouseY < 310) {
        if (rerollsLeft > 0) {
          hand[i] = drawCardFromDeck();
          rerollsLeft--;
        }
        return;
      }
    }

    // Draw new card if hand isn't full
    if (hand.length < 5 && cardsLeft > 0) {
      hand.push(drawCardFromDeck());
    }
  }

  if (gamePhase === 'shop') {
    handleShopClick();
  }
}


function handleMenuClick() {
  for (let i = 0; i < deckOptions.length; i++) {
    let x = width / 2 - 200;
    let y = 150 + i * 100;
    let w = 400;
    let h = 60;

    if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
      selectedDeckType = deckOptions[i].name;
      suits = deckOptions[i].suits;
      ranks = deckOptions[i].ranks;
      startNewGame();
      return;
    }
  }
}




function handleShopClick() {
  let startY = 180;
  let buttonWidth = 400;
  let buttonHeight = 60;
  let spacingY = 100;
  let spacingX = 450;

  for (let i = 0; i < shopItems.length; i++) {
    let col = i % 2;
    let row = Math.floor(i / 2);
    let x = width / 2 - spacingX / 2 + col * spacingX - 200;
    let y = startY + row * spacingY;

    if (
      mouseX > x && mouseX < x + buttonWidth &&
      mouseY > y && mouseY < y + buttonHeight &&
      money >= shopItems[i].cost
    ) {
      shopItems[i].action();
      money -= shopItems[i].cost;
      return;
    }
  }

  // Check for "Continue" click
  let continueY = startY + Math.ceil(shopItems.length / 2) * spacingY;
  if (
    mouseX > width / 2 - 100 &&
    mouseX < width / 2 + 100 &&
    mouseY > continueY &&
    mouseY < continueY + 50
  ) {
    startNewRound();
  }
}



function drawCard(card, x, y) {
  push();
  if(cardsLeft <= 0)
  {
    drawGameOver()
  }
  translate(x, y);
  fill(255);
  rect(0, 0, 120, 160, 10);
  if (card.suit == 'hearts' || card.suit == 'diamonds') {
    fill('red');
  } else {
    fill('black');
  }
  textSize(20);
  textAlign(LEFT, TOP);
  text(card.rank, 10, 10);
  text(suitSymbols[card.suit], 10, 40);

  textAlign(RIGHT, BOTTOM);
  text(card.rank, 110, 150);
  text(suitSymbols[card.suit], 110, 120);
  pop();
}

function drawMysteryCard(x, y, joker) {
  push();
  translate(x, y);
  fill(joker.color);
  rect(0, 0, 100, 140, 10);
  fill(0);
  textSize(60);
  textAlign(CENTER, CENTER);
  text('J', 50, 50);
  textSize(16);
  text(`${joker.multiplier.toFixed(2)}x`, 50, 110);
  pop();
}

function generateJoker() {
  let r = random(1);
  if (r < l1) {
    return { multiplier: random(1, 2), color: 'gray' };
  } else if (r < l2) {
    return { multiplier: random(2, 3.5), color: '#9FE2BF'  };
  } else if (r < l3) {
    return { multiplier: random(3.5, 10), color: '#f22253' };
  } else if (r < l4) {
    numCap+=1
    return { multiplier: random(10, 50), color: '#7b03fc' };
  } else {
    numCap+=2
    return { multiplier: 100, color: 'gold' };
  }
}

function startNewGame() 
{
  score = 0;
  hand = [];
  handsPlayed = 0;
  handEvaluated = false;
  lastHandResult = '';
  lastHandPoints = 0;
  gamePhase = 'playing';
  win = false;
  deck = createDeck();
  shuffleDeck(deck);
  hand = deck.splice(0, 5);
  cardsLeft = deck.length;
  targetScore = 500;
  rerollsLeft = 10;
  rollups = 0;
  scoreMultiplier = 1.0;
  roundNumber = 1;
  money = 0;
  jex = 0;
  numCap = 6;
  mysteryCards = [];
}

function startNewRound() {
  
  hand = [];
  handsPlayed = 0;
  score = 0;
  handEvaluated = false;
  lastHandResult = '';
  lastHandPoints = 0;
  gamePhase = 'playing';
  deck = createDeck();
  shuffleDeck(deck);
  cardsLeft = deck.length;
  if (roundNumber <= 4) 
{
  targetScore += 500;
} 
else 
{
  let growth = 500 + 150 * (roundNumber* roundNumber);
  targetScore += growth;
}

  roundNumber++;
  rerollsLeft = 10 + rollups;
  if (roundNumber > 17) {
    gamePhase = 'gameover';
    win = true;
  }
}

function createDeck() {
  let deck = [];
  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push({ suit: suit, rank: rank });
    }
  }
  return deck;
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    let j = floor(random(i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function drawCardFromDeck() {
  if (cardsLeft > 0) {
    cardsLeft--;
    return deck.pop();
  }
  return null;
}

function scoreHand() {
  if (gamePhase !== 'playing') return;
  if (hand.length !== 5) return;
  if (handEvaluated) return;

  let result = evaluateHand();
  lastHandResult = result.message;
  lastHandPoints = result.points;
  score += lastHandPoints;
  handEvaluated = true;
  handsPlayed++;

  if (score >= targetScore) {
    let moneyGained = 400 + Math.pow(1.3, roundNumber) * 100;
    money += floor(moneyGained);
    money += (maxHands - handsPlayed) * 100
    if( score < 3*targetScore)
    {
    money += (score-targetScore) * 0 
    }
    gamePhase = 'shop';
  } else if (handsPlayed >= maxHands) {
    gamePhase = 'gameover';
    win = false;
  }

  if (gamePhase === 'playing') {
    hand = [];
    handEvaluated = false;
    lastHandResult = '';
    lastHandPoints = 0;
  }
}

function evaluateHand() {
  let suitsCount = {};
  let ranksCount = {};
  let ranksList = [];

  for (let card of hand) {
    suitsCount[card.suit] = (suitsCount[card.suit] || 0) + 1;
    ranksCount[card.rank] = (ranksCount[card.rank] || 0) + 1;
    ranksList.push(typeof card.rank === 'number' ? card.rank : faceCardToValue(card.rank));
  }

  ranksList.sort((a, b) => a - b);

  let isFlush = Object.values(suitsCount).some(count => count === 5);
  let isStraight = ranksList.every((val, idx, arr) => idx === 0 || val === arr[idx - 1] + 1);

  let counts = Object.values(ranksCount).sort((a, b) => b - a);

  let points = 0;
  let message = '';

  if (isFlush && isStraight) {
    message = 'Straight Flush!';
    points = 12000;
  } else if (counts[0] === 4) {
    message = 'Four of a Kind!';
    points = 3000;
  } else if (counts[0] === 3 && counts[1] === 2) {
    message = 'Full House!';
    points = 1500;
  } else if (isFlush) {
    message = 'Flush!';
    points = 1100;
  } else if (isStraight) {
    message = 'Straight!';
    points = 900;
  } else if (counts[0] === 3) {
    message = 'Three of a Kind!';
    points = 600;
  } else if (counts[0] === 2 && counts[1] === 2) {
    message = 'Two Pair!';
    points = 400;
  } else if (counts[0] === 2) {
    message = 'One Pair!';
    points = 150;
  } else {
    message = 'No Combo';
    points = 75;
  }

  // Apply mystery Joker multipliers
  let totalMultiplier = 1.0;
  for (let joker of mysteryCards) {
    totalMultiplier *= joker.multiplier;
  }

  points = floor(points * totalMultiplier);

  return { message, points };
}

function faceCardToValue(face) {
  if (face === 'J') return 11;
  if (face === 'Q') return 12;
  if (face === 'K') return 13;
  if (face === 'A') return 14;
}


function drawScoreButton() {
  fill(50, 200, 140);
  rect(20, height - 50, 200, 30, 10);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(16);
  text('Score Hand [Click]', 120, height - 35);
}

function drawShowValuesButton() {
  fill(50, 160, 200);
  rect(width - 220, height - 50, 200, 30, 10);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(16);
  text('Show Hand Values [Click]', width - 120, height - 35);
}


function drawHandValuesPopup() {
  fill(50, 50, 50, 230);
  rect(width / 2 - 200, height / 2 - 250, 400, 500, 20);
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);

  let y = height / 2 - 230;
  let spacing = 30;
  let handTypes = [
    'Straight Flush - 12000',
    'Four of a Kind - 3000',
    'Full House - 1500',
    'Flush - 1100',
    'Straight - 900',
    'Three of a Kind - 600',
    'Two Pair - 400',
    'One Pair - 150',
    'No Combo - 75'
  ];

  for (let i = 0; i < handTypes.length; i++) {
    text(handTypes[i], width / 2 - 180, y + i * spacing);
  }
}
