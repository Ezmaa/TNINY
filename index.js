const textElement = document.getElementById("text");
const optionButtonsElement = document.getElementById("option-bttns");
const timer = document.getElementById("timer");
const startButton = document.getElementById("start-button");
const buttons = document.getElementById('options-bttns');
const leaderBoard = document.getElementById('leaderBoard');

let state = {};
let secondsLeft = 180;
let totalScore = 0;
let scores = JSON.parse(localStorage.getItem('scores')) || [];

let gameStart = false;

function playGame() {
    
  startButton.hidden = true;
  optionButtonsElement.style.display = "block";
  if(gameStart === false) {
    startTime()
    gameStart = true;
  }
  
  state = {};
  showTextNode(1);
}

startButton.addEventListener("click", playGame);

function startTime() {
  const timerInterval = setInterval(function () {
    let index = 0;
    secondsLeft--;
    timer.textContent = "Time Left: " + secondsLeft;
    if (secondsLeft <= 0 || index >= questionsArr.length) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

function showTextNode(textNodeIndex) {
  const textNode = textNodes.find((textNode) => textNode.id === textNodeIndex);
  textElement.innerText = textNode.text;
  while (optionButtonsElement.firstChild) {
    optionButtonsElement.removeChild(optionButtonsElement.firstChild);
  }

  textNode.options.forEach((option) => {
    if (showOption(option)) {
      const button = document.createElement("bttn");
      button.innerText = option.text;
      button.classList.add("btn");
      button.addEventListener("click", () => selectOption(option));
      optionButtonsElement.appendChild(button);
    }
  });
}

function showOption(option) {
  return option.requiredState == null || option.requiredState(state);
}

function selectOption(option) {
  const nextTextNodeId = option.nextText;
  if (nextTextNodeId <= 0) {
    return playGame();
  }
  state = Object.assign(state, option.setState);
  showTextNode(nextTextNodeId);
}



const textNodes = [
  {
    id: 1,
    text: "You wake up in a strange place and you see a jar of blue goo near you.",
    options: [
      {
        text: "Take the goo",
        score: 5,
        setState: { blueGoo: true },
        nextText: 2,
      },
      {
        text: "Leave the goo",
        score: 7,
        nextText: 2,
      },
    ],
  },
  {
    id: 2,
    text: "You venture forth in search of answers to where you are when you come across a merchant.",
    options: [
      {
        text: "Trade the goo for a sword",
        score: 7,
        requiredState: (currentState) => currentState.blueGoo,
        setState: { blueGoo: false, sword: true },
        nextText: 3,
      },
      {
        text: "Trade the goo for a shield",
        score: 7,
        requiredState: (currentState) => currentState.blueGoo,
        setState: { blueGoo: false, shield: true },
        nextText: 3,
      },
      {
        text: "Ignore the merchant",
        score: 5,
        nextText: 3,
      },
    ],
  },
  {
    id: 3,
    text: "After leaving the merchant you start to feel tired and stumble upon a small town next to a dangerous looking castle.",
    options: [
      {
        text: "Explore the castle",
        score: 7,
        nextText: 4,
      },
      {
        text: "Find a room to sleep at in the town",
        score: 8,
        nextText: 5,
      },
      {
        text: "Find some hay in a stable to sleep in",
        score: 5,
        nextText: 6,
      },
    ],
  },
  {
    id: 4,
    text: "You are so tired that you fall asleep while exploring the castle and are killed by some terrible monster in your sleep.",
    options: [
      {
        text: "Restart",
        score: 5,
        nextText: -1,
      },
    ],
  },
  {
    id: 5,
    text: "Without any money to buy a room you break into the nearest inn and fall asleep. After a few hours of sleep the owner of the inn finds you and has the town guard lock you in a cell.",
    options: [
      {
        text: "Restart",
        score: 5,
        nextText: -1,
      },
    ],
  },
  {
    id: 6,
    text: "You wake up well rested and full of energy ready to explore the nearby castle.",
    options: [
      {
        text: "Explore the castle",
        score: 8,
        nextText: 7,
      },
    ],
  },
  {
    id: 7,
    text: "While exploring the castle you come across a horrible monster in your path.",
    options: [
      {
        text: "Try to run",
        score: 9,
        nextText: 8,
      },
      {
        text: "Attack it with your sword",
        score: 9,
        requiredState: (currentState) => currentState.sword,
        nextText: 9,
      },
      {
        text: "Hide behind your shield",
        score: 9, 
        requiredState: (currentState) => currentState.shield,
        nextText: 10,
      },
      {
        text: "Throw the blue goo at it",
        score: 3, 
        requiredState: (currentState) => currentState.blueGoo,
        nextText: 11,
      },
    ],
  },
  {
    id: 8,
    text: "Your attempts to run are in vain and the monster easily catches.",
    options: [
      {
        text: "Restart",
        score: 7,
        nextText: -1,
      },
    ],
  },
  {
    id: 9,
    text: "You foolishly thought this monster could be slain with a single sword.",
    options: [
      {
        text: "Restart",
        score: 7,
        nextText: -1,
      },
    ],
  },
  {
    id: 10,
    text: "The monster laughed as you hid behind your shield and ate you.",
    options: [
      {
        text: "Restart",
        score: 7,
        nextText: -1,
      },
    ],
  },
  {
    id: 11,
    text: "You threw your jar of goo at the monster and it exploded. After the dust settled you saw the monster was destroyed. Seeing your victory you decide to claim this castle as your and live out the rest of your days there.",
    options: [
      {
        text: "Congratulations. Play Again.",
        score: 1,
        nextText: -1,
      },
    ],
  },
];



// Render scores in table
const renderTable = () => {
  const tableBody = document.getElementById('table-body');
  tableBody.innerHTML = '';
  scores.forEach((score, index) => {
    const row = document.createElement('tr');
    const rank = document.createElement('td');
    rank.textContent = index + 1;
    row.appendChild(rank);
    const name = document.createElement('td');
    name.textContent = score.name;
    row.appendChild(name);
    const scoreValue = document.createElement('td');
    scoreValue.textContent = score.score;
    row.appendChild(scoreValue);
    tableBody.appendChild(row);
  });
};

// Add score to list and persist in local storage
const addScore = (name, score) => {
  const newScore = { name, score };
  scores.push(newScore);
  scores.sort((a, b) => a.score - b.score);
  localStorage.setItem('scores', JSON.stringify(scores));
  renderTable();
};

// Handle submit button click
const submitButton = document.getElementById('submit-button');
submitButton.addEventListener('click', () => {
  const nameInput = document.getElementById('name-input');
  const scoreInput = document.getElementById('score-input');
  addScore(nameInput.value, parseInt(scoreInput.value));
  nameInput.value = '';
  scoreInput.value = '';
});

// Render table on page load
renderTable();


