const body = document.querySelector('.body');

body.innerHTML = ` 
<div class="header">
<select class="field-size">
  <option value="Простой">Простой</option>
  <option value="Средний">Средний</option>
  <option value="Сложный">Сложный</option>
</select>
<div class="number-bombs">
<div class="number-bombs__text">Введите количество бомб от 10-90:</div>
<input class="number-bombs__input" type="number" min="10" max="90" value="10">
</div>
<div class="flag"></div>
<img src="./imgs/click.png" alt="404">
<div class="quantity-clicks">
<div id="digit" class="quantity-click"><span class="quantity-click__number">0123456789</span></div>
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
const quantityClick = document.querySelector('.quantity-click__number');

let width = 10;
let height = 10;
let bombesCount = 10;

class StartGame {
  constructor(width, height, bombesCount) {
    this.width = width;
    this.height = height;
    this.bombesCount = bombesCount;
    this.numberCells = this.width * this.height;
  }

  createsSapperCells() {
    for (let i = 0; i < this.numberCells; i++) {
      field.innerHTML += `<div class="sapper__cells" ></div>`;
    }

    this.sapperCells = document.querySelectorAll('.sapper__cells');
    this.cells = [...field.children];

    this.closedCount = this.numberCells;

    this.bombs = [];

    this.isFirstClick = true;

    field.addEventListener('click', (event) => {
      if (event.target.className !== 'sapper__cells') {
        return;
      }

      this.index = this.cells.indexOf(event.target);
      this.column = this.index % this.width;
      this.row = Math.floor(this.index / this.width);

      // quantityClick += 1;

      if (this.isFlagClicked) {
        const index = this.row * this.width + this.column;
        flagIndex.push(index);
        this.sapperCells[index].textContent = '🚩';
        numberFlag--;
        isFlagClicked = false;
        flagNumber.innerHTML = numberFlag;

        return;
      }

      if (this.isFirstClick) {
        this.isFirstClick = false;
        this.bombs = [...Array(this.numberCells).keys()]
          .sort(() => Math.random() - 0.5)
          .filter((cell) => cell !== this.index)
          .slice(0, this.bombesCount);
      }
      if (this.sapperCells[this.index].innerHTML === '🚩') {
        numberFlag++;
        flagNumber.innerHTML = numberFlag;
        this.sapperCells[this.index].innerHTML = '';
      }

      this.open(this.row, this.column);
      this.addClassOpen(this.row, this.column);
    });
  }

  addClassOpen(row, column) {
    const index = row * this.width + column;
    if (this.sapperCells[index].innerHTML === '🚩') {
      return;
    }
    this.sapperCells[index].classList.add('active');
  }

  isValid(row, column) {
    return row >= 0 && row < this.height && column >= 0 && column < this.width;
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
      this.sapperCells[this.bombs[this.i - 1]].classList.add('active');
      setTimeout(this.withdrawalBombs.bind(this), 300);
      this.i++;
    }
  }

  open(row, column) {
    if (!this.isValid(row, column)) return;

    const index = row * this.width + column;
    const cell = this.cells[index];
    // if (this.sapperCells[index].innerHTML === '🚩') {
    //   return;
    // }
    if (cell.disabled === true) {
      return;
    }

    if (this.isBomb(row, column)) {
      cell.innerHTML = '💣';
      setTimeout(this.withdrawalBombs.bind(this), 300);
      popup.textContent = '⟳ Попробуй еще раз!';
      popup.classList.add('popup__lose-game');
      background.classList.add('darkening');

      return;
    }
    this.closedCount--;
    if (this.closedCount <= this.bombesCount) {
      popup.textContent = 'Ура! Вы нашли все мины за ## секунд и N ходов!';
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
    const index = row * this.width + column;
    return this.bombs.includes(index);
  }

  appearancePopup() {
    popup.addEventListener('click', (event) => {
      popup.classList.remove('popup__lose-game');
      background.classList.remove('darkening');
      this.i = 1;
      field.innerHTML = '';
      // flagNumber.innerHTML = bombesCount;
      this.createsSapperCells();
    });
  }
}

const startGame = new StartGame(width, height, bombesCount);
startGame.createsSapperCells();
startGame.appearancePopup();
// startGame.addClassOpen(this.row, this.column);
