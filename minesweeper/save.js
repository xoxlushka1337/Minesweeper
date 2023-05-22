function newGame(countClick, numberFlag, i, bombesCount) {
  const newGame = document.querySelector('.new-game');

  newGame.addEventListener('click', () => {
    soundClick.play();
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
    soundClick.play();
    if (theme.getAttribute('href') == './style/style.css') {
      theme.href = './style/dark.css';
    } else {
      theme.href = './style/style.css';
    }
  });
}
changingTopic();

function sound() {
  const sound = document.querySelector('.sound__icon');
  sound.addEventListener('click', () => {
    soundClick.play();
    if (sound.classList.toggle('sound')) {
      /* включаем аудио */
      console.log('выключим');
      soundExplosion.volume = 0;
      soundClickCell.volume = 0;
      soundClick.volume = 0;
      soundVictories.volume = 0;
      soundFlag.volume = 0;
    } else {
      soundExplosion.volume = 1;
      soundClickCell.volume = 0.5;
      soundClick.volume = 1;
      soundVictories.volume = 1;
      soundFlag.volume = 0.5;
    }
  });
}
sound();
