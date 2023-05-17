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

    const sapperCells = document.querySelectorAll('.sapper__cells');
    const cells = [...field.children];

    this.closedCount = this.numberCells;

    this.bombs = [];

    this.isFirstClick = true;

    field.addEventListener('click', (event) => {
      if (event.target.className !== 'sapper__cells') {
        return;
      }

      const index = cells.indexOf(event.target);
      const column = this.index % this.width;
      const row = Math.floor(this.index / this.width);

      // quantityClick += 1;

      if (isFlagClicked) {
        const index = row * width + column;
        flagIndex.push(index);
        sapperCells[index].textContent = '🚩';
        numberFlag--;
        isFlagClicked = false;
        flagNumber.innerHTML = numberFlag;

        return;
      }

      if (isFirstClick) {
        isFirstClick = false;
        bombs = [...Array(numberCells).keys()]
          .sort(() => Math.random() - 0.5)
          .filter((cell) => cell !== index)
          .slice(0, bombesCount);
      }
      if (sapperCells[index].innerHTML === '🚩') {
        numberFlag++;
        flagNumber.innerHTML = numberFlag;
        sapperCells[index].innerHTML = '';
      }

      open(row, column);
      addClassOpen(row, column);
    });
  }
}

const startGame = new StartGame(width, height, bombesCount);
startGame.createsSapperCells();
