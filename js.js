const body = document.querySelector('.body');

body.innerHTML = ` 
<div class="header">
<select class="field-size">
  <option value="Простой">Простой</option>
  <option value="Средний">Средний</option>
  <option value="Сложный">Сложный</option>
</select>
<div class="number-bombs wrapper">
<div class="number-bombs__icon">💣</div>
<input class="number-bombs__input" type="number" min="10" max="90" value="10">
</div>
<div class="flag wrapper"></div>
<div class="click wrapper">
<img class="click__icon" src="./imgs/клик.png" alt="404">
<div class="click__number number-text"></div>
</div>
<div class="stopwatch wrapper">
<img class="stopwatch__icon" src="./imgs/таймер.png" alt="" />
<div class="stopwatch__time number-text">000</div>
</div>
</div>
<main class="main">
    <div class="wrapper-button">
      <button class="new-game button">New game</button>
      <button class="save button">Continue game </button>
    </div>
      <div class="sapper">
        <div class="sapper__field"></div>
        <div class="sapper__popup"></div>
        <div class="popup-background"></div>
      </div>
      <div class="records-wrapper">
      <div class="records">
      <div class="records__title">Victories</div>
      <div class="records__content"></div>
      </div>
      </div>
    </main>`;

const popup = document.querySelector('.sapper__popup');
const fieldSize = document.querySelector('.field-size');
const background = document.querySelector('.popup-background');
const field = document.querySelector('.sapper__field');
const bombesCountInput = document.querySelector('.number-bombs__input');
const flag = document.querySelector('.flag');
const flagIcon = document.querySelector('.flag__icon');
const quantityClick = document.querySelector('.click__number');
const stopwatchTime = document.querySelector('.stopwatch__time');
const recordsContent = document.querySelector('.records__content');

let gameState = {
  openIndex: [],
  indexBombs: [],
  indexFlag: [],
  numberFlag: '',
  bombesCount: 10,
  countClick: '',
  width: '',
  height: '',
  seconds: '',
  fieldLevel: '',
};

if (localStorage.getItem('gameState') !== null) {
  // localStorage.clear('gameState');
  gameState = JSON.parse(localStorage.getItem('gameState'));
  console.log(gameState);
} else {
  saveGameState();
}

function saveGameState() {
  const serialGameState = JSON.stringify(gameState); // сериализуем его в строчку
  localStorage.setItem('gameState', serialGameState); // запишем его в хранилище по ключу "myKey"
}

gameState.openIndex = [];
gameState.indexFlag = [];
let savingWins = [];

if (localStorage.getItem('myKey') !== null) {
  const returnObj = JSON.parse(`[${localStorage.getItem('myKey')}]`); // спарсим его обратно объект
  savingWins = [...returnObj];
}

function renderWins() {
  recordsContent.innerHTML = '';
  for (let i = 0; i < savingWins.length; i += 2) {
    recordsContent.innerHTML += `<div class="records__text">Time: ${
      savingWins[i]
    } seconds; Clicks: ${savingWins[i + 1]}</div>`;
  }
}

renderWins();

let width = 10;
let height = 10;
let bombesCount = 2;

const soundExplosion = new Audio('./music/взрыв2.mp3');
const soundChoose = new Audio('./music/выбор.mp3');
const soundClickCell = new Audio('./music/кил2.mp3');
const soundClick = new Audio('./music/клик.mp3');
const soundVictories = new Audio('./music/победа.mp3');
const soundFlag = new Audio('./music/поставил-флаг.mp3');

soundFlag.volume = 0.5;
soundClickCell.volume = 0.5;

let milliseconds = 0;
let seconds = 0;
let interval;
class Stopwatch {
  countingSeconds() {
    milliseconds++;
    if (milliseconds > 99) {
      seconds++;
      gameState.seconds = seconds;
      stopwatchTime.textContent = `00${seconds}`;
      milliseconds = 0;
    }
    if (seconds > 9) {
      stopwatchTime.textContent = `0${seconds}`;
    }
    if (seconds > 99) {
      stopwatchTime.textContent = `${seconds}`;
    }
    saveGameState();
  }
}

const stopwatch = new Stopwatch(milliseconds, seconds);

class Clicks {
  counts() {
    this.countClick = 0;
    quantityClick.innerHTML = this.countClick;
  }
}

const clicks = new Clicks();
clicks.counts();

class FlagGenerator {
  constructor(bombesCount, bombGenerator) {
    this.bombesCount = bombesCount;
    this.bombGenerator = bombGenerator;
  }

  flagging() {
    this.bombesCount = bombesCount;

    this.isFlagClicked = false;
    this.numberFlag = bombesCount;
    gameState.numberFlag = this.numberFlag;

    flag.innerHTML = `<div class="flag__icon">🚩</div><div class="flag__number number-text">${this.numberFlag}</div>`;
    document.addEventListener('click', (e) => {
      if (e.target.className === 'flag__icon') {
        this.isFlagClicked = true;
        soundClick.play();
      }
    });
  }
}
const flagGenerator = new FlagGenerator(bombesCount);
flagGenerator.flagging();
const flagNumber = document.querySelector('.flag__number');

class BombGenerator {
  constructor(bombesCount) {
    this.bombesCount = bombesCount;
    this.flagGenerator = flagGenerator;
  }
  numberOfBombs() {
    document.addEventListener('keyup', (event) => {
      if (event.code === 'Enter') {
        field.innerHTML = '';
        this.bombesCount = bombesCountInput.value;
        if (this.bombesCount > 90) {
          this.bombesCount = 90;
          bombesCountInput.value = 90;
        }
        if (this.bombesCount < 10) {
          this.bombesCount = 10;
          bombesCountInput.value = 10;
        }
        this.flagGenerator.numberFlag = this.bombesCount;
        gameState.bombesCount = this.bombesCount;
        flagNumber.innerHTML = this.bombesCount;
        startGame.createsSapperCells(this.bombesCount);
      }
      saveGameState();
    });
    gameState.bombesCount = this.bombesCount;
    saveGameState();
  }
}

class DetermineFieldSize {
  constructor(width, height, bombesCount) {
    this.width = width;
    this.height = height;
    this.bombesCount = bombesCount;
  }

  fieldLevel() {
    gameState.fieldLevel = 'Простой';
    fieldSize.addEventListener('click', () => {
      soundClick.play();
      // let value;
      // if (localStorage.getItem('gameState') !== null) {
      //   value = gameState.fieldLevel;
      // } else {
      //   value = fieldSize.value;
      //   saveGameState();
      // }
      let value = fieldSize.value;
      // gameState.fieldLevel = value;
      // saveGameState();
      if (value === 'Простой') {
        this.width = 10;
        this.height = 10;
        field.innerHTML = '';
        field.classList.remove('average');
        field.classList.remove('complicated');
        gameState.width = this.width;
        gameState.height = this.height;
        gameState.fieldLevel = value;
        saveGameState();
        startGame.createsSapperCells(this.width, this.height);
        // if (localStorage.getItem('gameState') !== null) {
        //   startGame.createsSapperCells(gameState.width, gameState.height);
        // } else {
        //   startGame.createsSapperCells(this.width, this.height);
        // }
        return;
      }
      if (value === 'Средний') {
        this.width = 15;
        this.height = 15;
        field.innerHTML = '';
        field.classList.remove('complicated');
        field.classList.add('average');
        gameState.width = this.width;
        gameState.height = this.height;
        gameState.fieldLevel = value;
        saveGameState();
        // if (localStorage.getItem('gameState') !== null) {
        //   startGame.createsSapperCells(gameState.width, gameState.height);
        // } else {
        startGame.createsSapperCells(this.width, this.height);
        // }
        return;
      }
      if (value === 'Сложный') {
        this.width = 25;
        this.height = 25;
        field.innerHTML = '';
        field.classList.remove('average');
        field.classList.add('complicated');
        gameState.width = this.width;
        gameState.height = this.height;
        gameState.fieldLevel = value;
        saveGameState();
        // if (localStorage.getItem('gameState') !== null) {
        //   startGame.createsSapperCells(gameState.width, gameState.height);
        // } else {
        //   startGame.createsSapperCells(this.width, this.height);
        // }
        startGame.createsSapperCells(this.width, this.height);
        return;
      }
    });
  }
}

class StartGame {
  constructor(
    width,
    height,
    bombesCount,
    determineFieldSize,
    bombGenerator,
    flagGenerator,
    clicks
  ) {
    this.width = width;
    this.height = height;
    this.bombesCount = bombesCount;
    this.determineFieldSize = determineFieldSize;
    this.bombGenerator = bombGenerator;
    this.flagGenerator = flagGenerator;
    this.clicks = clicks;
  }

  createsSapperCells(width, height) {
    this.bombs = [];

    this.isFirstClick = true;

    // if (localStorage.getItem('gameState') !== null) {
    this.numberCells = width * height;
    this.bombesCount = this.bombGenerator.bombesCount;

    for (let i = 0; i < this.numberCells; i++) {
      field.innerHTML += `<div class="sapper__cells" ></div>`;
    }
    this.closedCount = this.numberCells;
    this.sapperCells = document.querySelectorAll('.sapper__cells');
    this.cells = [...field.children];
    // } else {
    // this.numberCells =
    //   this.determineFieldSize.width * this.determineFieldSize.height;
    // this.bombesCount = this.bombGenerator.bombesCount;

    // // gameState.width = this.determineFieldSize.width;
    // // gameState.height = this.determineFieldSize.height;

    // for (let i = 0; i < this.numberCells; i++) {
    //   field.innerHTML += `<div class="sapper__cells" ></div>`;
    // }

    // this.sapperCells = document.querySelectorAll('.sapper__cells');

    // this.cells = [...field.children];

    this.closedCount = this.numberCells;
  }
  // }
  clickProcessing() {
    // if (localStorage.getItem('gameState') !== null) {
    //   const index = row * gameState.width + column;

    // }
    field.addEventListener('click', (event) => {
      if (event.target.className !== 'sapper__cells') {
        return;
      }

      this.index = this.cells.indexOf(event.target);
      this.column = this.index % this.determineFieldSize.width;
      this.row = Math.floor(this.index / this.determineFieldSize.width);

      if (this.flagGenerator.isFlagClicked) {
        const index = this.row * this.determineFieldSize.width + this.column;
        this.sapperCells[index].textContent = '🚩';
        gameState.indexFlag.push(index);
        saveGameState();
        this.flagGenerator.numberFlag--;
        gameState.numberFlag = this.flagGenerator.numberFla;
        soundFlag.play();
        this.flagGenerator.isFlagClicked = false;
        flagNumber.innerHTML = this.flagGenerator.numberFlag;

        return;
      }
      soundClickCell.play();

      if (this.isFirstClick) {
        this.isFirstClick = false;
        this.bombs = [...Array(this.numberCells).keys()]
          .sort(() => Math.random() - 0.5)
          .filter((cell) => cell !== this.index)
          .slice(0, this.bombesCount);
      }
      gameState.indexBombs = [...this.bombs];
      this.clicks.countClick += 1;
      gameState.countClick = this.clicks.countClick;
      if (this.clicks.countClick === 1) {
        clearInterval(interval);
        interval = setInterval(stopwatch.countingSeconds.bind(this), 10);
      }

      quantityClick.innerHTML = this.clicks.countClick;

      if (this.sapperCells[this.index].innerHTML === '🚩') {
        gameState.indexFlag = [];
        this.flagGenerator.numberFlag++;
        gameState.numberFlag = this.flagGenerator.numberFlag;
        flagNumber.innerHTML = this.flagGenerator.numberFlag;
        this.sapperCells[this.index].innerHTML = '';
      }

      this.open(this.row, this.column);
      this.addClassOpen(this.row, this.column);

      saveGameState();
    });
  }

  addClassOpen(row, column) {
    if (localStorage.getItem('gameState') !== null) {
      const index = row * gameState.width + column;
      if (this.sapperCells[index].innerHTML === '🚩') {
        return;
      }
      this.sapperCells[index].classList.add('active');
    }
    const index = row * this.determineFieldSize.width + column;
    if (this.sapperCells[index].innerHTML === '🚩') {
      return;
    }
    this.sapperCells[index].classList.add('active');
  }

  isValid(row, column) {
    return (
      row >= 0 &&
      row < this.determineFieldSize.height &&
      column >= 0 &&
      column < this.determineFieldSize.width
    );
  }

  getCount(row, column) {
    let count = 0;
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        if (this.isBomb(row + y, column + x)) {
          count++;
        }
      }
    }
    return count;
  }

  i = 1;
  withdrawalBombs() {
    if (this.i <= this.bombesCount) {
      this.cells[this.bombs[this.i - 1]].innerHTML = '💣';
      soundClickCell.pause();
      this.sapperCells[this.bombs[this.i - 1]].classList.add('active');
      soundExplosion.play();
      setTimeout(this.withdrawalBombs.bind(this), 300);
      this.i++;
    }
  }

  open(row, column) {
    if (!this.isValid(row, column)) return;

    const index = row * this.determineFieldSize.width + column;
    const cell = this.cells[index];
    if (this.sapperCells[index].innerHTML === '🚩') {
      return;
    }
    if (cell.disabled === true) {
      return;
    }

    if (this.isBomb(row, column)) {
      cell.innerHTML = '💣';
      soundExplosion.play();
      setTimeout(this.withdrawalBombs.bind(this), 300);
      clearInterval(interval);
      milliseconds = 0;
      seconds = 0;
      stopwatchTime.innerHTML = '000';
      popup.textContent = '⟳ Попробуй еще раз!';
      popup.classList.add('popup__lose-game');
      background.classList.add('darkening');

      return;
    }
    this.closedCount--;
    if (this.closedCount === this.bombesCount) {
      soundVictories.play();
      clearInterval(interval);

      let endingSeconds = 'секунд';
      let endingMove = 'ходов';
      if (seconds === 1 || this.clicks.countClick === 1) {
        endingSeconds = 'секунду';
        endingMove = 'ход';
      }
      if (
        seconds >= 2 ||
        seconds <= 4 ||
        this.clicks.countClick >= 2 ||
        this.clicks.countClick <= 4
      ) {
        endingSeconds = 'секунды';
        endingMove = 'хода';
      }

      if (localStorage.getItem('myKey') !== null) {
        savingWins = [];
        const returnObj = JSON.parse(`[${localStorage.getItem('myKey')}]`); // спарсим его обратно объект
        savingWins = [...returnObj];
        if (savingWins.length === 20) {
          savingWins.splice(0, 2);
        }
      }

      savingWins.push(seconds, this.clicks.countClick);
      localStorage.setItem('myKey', savingWins); // запишем его в хранилище по ключу "myKey"
      renderWins();
      popup.textContent = `Ура! Вы нашли все мины за ${seconds} ${endingSeconds} и ${this.clicks.countClick} ${endingMove}!`;
      popup.classList.add('popup__lose-game');
      background.classList.add('darkening');
      return;
    }

    cell.disabled = true;
    gameState.openIndex.push(index);
    this.addClassOpen(row, column);

    const count = this.getCount(row, column);
    if (count !== 0) {
      cell.innerHTML = count;
      cell.classList.add(`bomb-count-${count}`);
      return;
    }

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        this.open(row + y, column + x);
      }
    }
  }

  isBomb(row, column) {
    if (!this.isValid(row, column)) {
      return false;
    }
    const index = row * this.determineFieldSize.width + column;
    return this.bombs.includes(index);
  }

  appearancePopup() {
    popup.addEventListener('click', (event) => {
      popup.classList.remove('popup__lose-game');
      background.classList.remove('darkening');
      soundClick.play();
      clearInterval(interval);
      milliseconds = 0;
      seconds = 0;
      stopwatchTime.innerHTML = '000';
      this.i = 1;
      field.innerHTML = '';
      gameState.openIndex = [];
      gameState.indexFlag = [];
      this.flagGenerator.numberFlag = this.bombesCount;
      flagNumber.innerHTML = this.bombesCount;
      this.clicks.countClick = 0;
      quantityClick.innerHTML = this.clicks.countClick;
      this.createsSapperCells();
    });
  }
}

const bombGenerator = new BombGenerator(bombesCount, flagGenerator);
bombGenerator.numberOfBombs();
const determineFieldSize = new DetermineFieldSize(width, height, bombesCount);
determineFieldSize.fieldLevel();
const startGame = new StartGame(
  width,
  height,
  bombesCount,
  determineFieldSize,
  bombGenerator,
  flagGenerator,
  clicks
);
// startGame.createsSapperCells();
startGame.clickProcessing();
startGame.appearancePopup();

if (localStorage.getItem('gameState') !== null) {
  startGame.createsSapperCells(gameState.width, gameState.height);
} else {
  startGame.createsSapperCells(width, height);
}

// console.log(gameState);
// startGame.addClassOpen(this.row, this.column);
