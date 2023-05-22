function newGame(countClick, numberFlag, i, bombesCount) {
  const newGame = document.querySelector('.new-game');

  newGame.addEventListener('click', () => {
    clearInterval(interval);
    milliseconds = 0;
    seconds = 0;
    stopwatchTime.innerHTML = '000';
    i = 1;
    field.innerHTML = '';
    gameState.openIndex = [];
    gameState.indexFlag = [];
    numberFlag = bombesCount;
    flagNumber.innerHTML = bombesCount;
    countClick = 0;
    quantityClick.innerHTML = countClick;
    startGame.createsSapperCells();
  });
}
newGame(
  startGame.clicks.countClick,
  startGame.flagGenerator.numberFlag,
  startGame.i,
  startGame.bombesCount
);

function changingTopic() {
  let theme = document.getElementById('theme');
  const switchTheme = document.querySelector('.slider');
  switchTheme.addEventListener('click', () => {
    if (theme.getAttribute('href') == './style/style.css') {
      theme.href = './style/dark.css';
    } else {
      theme.href = './style/style.css';
    }
    // if (switchCheckbox.checked) {
    // }
  });
}
changingTopic();
