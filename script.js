// Уровни сложности с набором слов
const levels = {
  // Легкий уровень сложности 3-4 буквы
  easy: {
    levelName: "легкий",
    wordRange: ["cat", "book", "star", "code", "find", "from", "lost", "dog", "man", "pack"],
  },
  // Средний уровень сложности 5-6 букв
  middle: {
    levelName: "средний",
    wordRange: ["strong", "stand", "friend", "stonks", "horror", "movie", "header", "script", "learn", "enter"],
  },
  // Сложный уровень сложности 7-8 букв
  hard: {
    levelName: "сложный",
    wordRange: ["storage", "champion", "diamond", "elephant", "fantasia", "gigantic", "hospital", "digital", "typical", "monitor"],
  },
};

// Объект игры
const game = {
  // Текущий уровень сложности с набором слов
  currentLevel: {},

  // Текущий раунд
  currentRound: {},

  // Результаты раундов
  roundResults: [],

  // Флаг, запустить игру снова
  startAgain: false,

  // Запуск игры
  startGame: function () {
    let wantGame = confirm("Хотите сыграть?");

    if (!wantGame) {
      return;
    }

    this.setLevel();
    this.startRound();
    this.showItog();

    if (this.startAgain) {
      this.startAgain = false;
      this.startGame();
    }
  },

  // Выбор уровня сложности
  setLevel: function () {
    const textQuestion = `
      Выберите уровень сложности:
      1) Легкий
      2) Средний
      3) Тяжелый 
      (введите цифру, соответствующую уровню сложности - 1, 2, 3)`;

    let levelNum = prompt(textQuestion, "1");

    switch (levelNum) {
      case "1":
        this.currentLevel = { ...levels.easy };
        break;
      case "2":
        this.currentLevel = { ...levels.middle };
        break;
      case "3":
        this.currentLevel = { ...levels.hard };
        break;
      default:
        alert("Вы ввели не цифру, соответствующую уровню сложности, введите еще раз - 1,2 или 3");
        this.setLevel();
    }
  },

  // Запуск раунда
  startRound: function () {
    this.setCurrentRound();
    this.ask();
    this.showResults();
  },

  // Заполнение данных по текущему раунду
  setCurrentRound: function () {
    this.currentRound = new CurrentRound();
    this.currentRound.word = this.currentLevel.wordRange[Math.floor(Math.random() * this.currentLevel.wordRange.length)];
    this.currentRound.wordTemp = this.currentRound.word.replace(/./gi, "*");
  },

  // Спросить слово или букву
  ask: function () {
    let askLetter = confirm(`
      Слово ${this.currentRound.wordTemp}, количество букв ${this.currentRound.word.length}.
      Угадать букву? (Отмена - угадать слово)`);

    if (askLetter) {
      // Ввод буквы
      let letter = this.askLetter();
      this.checkLetter(letter);
    } else {
      // Ввод слова
      let word = this.askWord();
      this.checkWord(word);
    }

    // Слово отгадано
    if (this.currentRound.wordTemp == this.currentRound.word) {
      this.addResult((isSuccess = true));
      return;
    }

    // Если истекли жизни, раунд заканчивается поражением
    if (this.currentRound.liveCount == 0) {
      this.addResult((isSuccess = false));
      return;
    }

    this.ask();
  },

  askLetter: function () {
    let letter = prompt(`
      Слово ${this.currentRound.wordTemp}, количество букв ${this.currentRound.word.length}. 
      Введите букву`);

    if (letter.length > 1) {
      alert("Введите одну букву!");
      letter = this.askLetter();
    } else if (!/^[a-zA-Z]$/gi.test(letter)) {
      alert("Допускается только ввод английской буквы!");
      letter = this.askLetter();
    }

    return letter;
  },

  askWord: function () {
    let word = prompt(`
      Слово ${this.currentRound.wordTemp}, количество букв ${this.currentRound.word.length}. 
      Введите слово`);

    if (!/^[a-zA-Z]+$/gi.test(word)) {
      alert("Допускается только ввод английских букв!");
      word = this.askWord();
    }

    return word;
  },

  checkLetter: function (letter) {
    const regex = new RegExp(letter, "gi");
    const matches = [...this.currentRound.word.matchAll(regex)];

    if (matches.length == 0) {
      this.currentRound.liveCount = this.currentRound.liveCount - 1;
    }

    let wordTempArr = this.currentRound.wordTemp.split("");

    for (const match of matches) {
      wordTempArr[match.index] = letter;
    }

    this.currentRound.wordTemp = wordTempArr.join("");
  },

  checkWord: function (word) {
    const regex = new RegExp(word, "i");

    if (this.currentRound.word.match(regex)) {
      this.currentRound.wordTemp = this.currentRound.word;
    } else {
      this.currentRound.liveCount = this.currentRound.liveCount - 1;
    }
  },

  // Добавление результата раунда
  addResult: function (isSuccess = true) {
    this.currentRound.isSuccess = isSuccess;
    if (this.currentRound.isSuccess) {
      this.currentRound.isSuccessText = "Да";
    }

    this.setRoundTime();

    this.roundResults.push(this.currentRound);

    //Удаляем слово
    const index = this.currentLevel.wordRange.indexOf(this.currentRound.word);
    this.currentLevel.wordRange.splice(index, 1);
  },

  // Время выполнения раунда в строке
  setRoundTime: function () {
    const timeRound = Date.now() - this.currentRound.timeBegin;

    let seconds = timeRound / 1000;
    let secs = Math.floor(seconds % 60);
    let minutes = (seconds - secs) / 60;
    let mins = Math.floor(minutes % 60);
    let hrs = Math.floor((minutes - mins) / 60);

    let secsStr = this.timeUnitToStr(secs);
    let minsStr = this.timeUnitToStr(mins);
    let hrsStr = this.timeUnitToStr(hrs);

    this.currentRound.roundTime = `${hrsStr}:${minsStr}:${secsStr}`;
  },

  timeUnitToStr(timeUnit) {
    let timeUnitStr = timeUnit.toString();

    if (timeUnitStr.length < 2) {
      timeUnitStr = `0${timeUnitStr}`;
    }
    return timeUnitStr;
  },

  // Показ результатов
  showResults: function () {
    const countSuccess = this.getCountSuccess();
    const countFails = this.roundResults.length - countSuccess;

    let textResult = `
      Сложность: ${this.currentLevel.levelName} 
      Количество побед: ${countSuccess}
      Количество поражений: ${countFails}
      \r
      Рейтинг:
      Слово  | Угадал | Длительность`;

    for (result of this.roundResults) {
      textResult = `${textResult}
      ${result.word} | ${result.isSuccessText} | ${result.roundTime}`;
    }

    if (this.currentLevel.wordRange.length > 0) {
      textResult = `${textResult} \r\r Начать новый раунд?`;
      const startNewRound = confirm(textResult);

      if (startNewRound) {
        this.startRound();
      }
    } else {
      // Список слов закончился
      alert(textResult);
    }

  },

  // Количество успешных раундов
  getCountSuccess: function () {
    const successArr = this.roundResults.filter((item) => item.isSuccess == true);
    return successArr.length;
  },

  showItog: function () {
    const countSuccess = this.getCountSuccess();
    const countFails = this.roundResults.length - countSuccess;

    const itogText = countSuccess > countFails ? "Молодец" : "Молодец, в следующий раз получится лучше";
    this.roundResults.length = 0;

    this.startAgain = confirm(`\rИтог игры: ${itogText}.\rНачать новую игру?`);
  },
};

// Текущий раунд
class CurrentRound {
  constructor() {
    this.word = "";
    this.wordTemp = "";
    this.isSuccess = false;
    this.isSuccessText = "Нет";
    this.timeBegin = Date.now();
    this.roundTime = 0;
    this.liveCount = 3; // Количество жизней
  }
}

// Запуск игры
game.startGame();
