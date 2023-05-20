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
<div class="sapper">
<div class="sapper__field"></div>
<div class="popup"></div>
<div class="background"></div>
</div>`;

const popup = document.querySelector('.popup');
const fieldSize = document.querySelector('.field-size');
const background = document.querySelector('.background');
const field = document.querySelector('.sapper__field');
const bombesCountInput = document.querySelector('.number-bombs__input');
const flag = document.querySelector('.flag');
const flagIcon = document.querySelector('.flag__icon');
const quantityClick = document.querySelector('.click__number');
const stopwatchTime = document.querySelector('.stopwatch__time');

const gameState = {
  openIndex: [],
  indexBombs: [],
  indexFlag: [],
  numberFlag: '',
  bombesCount: '',
  countClick: '',
  width: '',
  height: '',
  seconds: '',
  fieldLevel: '',
};

let width = 10;
let height = 10;
let bombesCount = 10;

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
    });
    gameState.bombesCount = this.bombesCount;
  }
}

class DetermineFieldSize {
  constructor(width, height, bombesCount) {
    this.width = width;
    this.height = height;
    this.bombesCount = bombesCount;
  }

  fieldLevel() {
    this.sizeCell = '';

    fieldSize.addEventListener('click', () => {
      soundClick.play();
      let value = fieldSize.value;
      gameState.fieldLevel = value;
      if (value === 'Простой') {
        this.width = 10;
        this.height = 10;
        gameState.width = this.width;
        gameState.height = this.height;
        field.innerHTML = '';
        field.classList.remove('average');
        field.classList.remove('complicated');
        startGame.createsSapperCells(this.width, this.height);
        return;
      }
      if (value === 'Средний') {
        this.width = 15;
        this.height = 15;
        field.innerHTML = '';
        field.classList.remove('complicated');
        field.classList.add('average');
        startGame.createsSapperCells(this.width, this.height);
        return;
      }
      if (value === 'Сложный') {
        this.width = 25;
        this.height = 25;
        field.innerHTML = '';
        field.classList.remove('average');
        field.classList.add('complicated');
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

  createsSapperCells() {
    this.numberCells =
      this.determineFieldSize.width * this.determineFieldSize.height;
    this.bombesCount = this.bombGenerator.bombesCount;

    for (let i = 0; i < this.numberCells; i++) {
      field.innerHTML += `<div class="sapper__cells" ></div>`;
    }

    this.sapperCells = document.querySelectorAll('.sapper__cells');

    this.cells = [...field.children];

    this.closedCount = this.numberCells;

    this.bombs = [];

    this.isFirstClick = true;
  }
  clickProcessing() {
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
        this.flagGenerator.numberFlag++;
        gameState.numberFlag = this.flagGenerator.numberFlag;
        flagNumber.innerHTML = this.flagGenerator.numberFlag;
        this.sapperCells[this.index].innerHTML = '';
      }

      this.open(this.row, this.column);
      this.addClassOpen(this.row, this.column);
    });
  }

  addClassOpen(row, column) {
    const index = row * this.determineFieldSize.width + column;
    if (this.sapperCells[index].innerHTML === '🚩') {
      return;
    }
    gameState.openIndex.push(index);
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
    if (this.closedCount <= this.bombesCount) {
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
      popup.textContent = `Ура! Вы нашли все мины за ${seconds} ${endingSeconds} и ${this.clicks.countClick} ${endingMove}!`;
      popup.classList.add('popup__lose-game');
      background.classList.add('darkening');
      return;
    }

    cell.disabled = true;
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
startGame.createsSapperCells();
startGame.clickProcessing();
startGame.appearancePopup();

// startGame.addClassOpen(this.row, this.column);
