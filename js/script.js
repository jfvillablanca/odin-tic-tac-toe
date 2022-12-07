// TODO:
// / Game reset
// - DOM popup winner/draw
// / Scores
// - Player choose their game piece
// / Display whose turn it is (Partial)
// / Highlight winning cells
// / Prettify the game board in css
// NOTE: Check MutationObserver API for the resetgame button problem

const documentMock = (() => ({
  querySelector: (_selector) => ({
    textContent: null,
  }),
}))();

const Gameboard = (function (doc) {
  "use strict";

  let _gridCells = null;
  let _gamePieceX = null;
  let _gamePieceO = null;
  let _gameBanner;
  let _gameScore;
  let _scoreX = 0;
  let _scoreO = 0;

  // NOTE: It takes 5 moves to win the game.
  // Example: If player 1 tries to win ASAP and player 2 plays ignorantly,
  // player 1 wins after placing their piece 3 times.
  const MINIMUM_MOVE_COUNT_TO_WIN = 5;
  const MAXIMUM_MOVE_COUNT = 9;

  // the _moveCount starts at 1 since increment happens on _toggleCurrentGamePiece()
  let _moveCount = 1;
  let _currentGamePiece = "X";
  const _gameBoardArray = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  let _srcAssetX;
  let _srcAssetO;

  const init = function (srcX, srcO) {
    _moveCount = 1;
    _currentGamePiece = "X";
    for (const row in _gameBoardArray) {
      _gameBoardArray[row] = [0, 0, 0];
    }
    _cacheDOM(srcX, srcO);
  };

  const _cacheDOM = function (srcX, srcO) {
    _srcAssetX = srcX;
    _srcAssetO = srcO;
    _gamePieceX = doc.createElement("img");
    _gamePieceX.setAttribute("src", _srcAssetX);
    _gamePieceO = doc.createElement("img");
    _gamePieceO.setAttribute("src", _srcAssetO);
    _gridCells = doc.querySelectorAll(".tictacgrid");

    _gridCells.forEach((_gridCell) => {
      _gridCell.addEventListener("click", _addToGameBoard);
      _gridCell.classList.add("enabled");
    });

    _gameBanner = doc.querySelector(".gamebanner");
    _gameScore = doc.querySelector(".score");
  };

  const _render = function () {
    _gameBanner.textContent = `Your turn: ${_currentGamePiece}`;
    _gameScore.textContent = `X: [${_scoreX}]    O: [${_scoreO}] `;
    //
    [..._gridCells].forEach((_gridCell) => {
      const row = +_gridCell.getAttribute("data-row");
      const column = +_gridCell.getAttribute("data-column");
      const _gamePieceRender = doc.createElement("img");

      if (
        _gameBoardArray[row][column] === "X" &&
        _gridCell.firstChild === null
      ) {
        _gamePieceRender.setAttribute("src", _gamePieceX.getAttribute("src"));
        _gridCell.appendChild(_gamePieceRender);
      } else if (
        _gameBoardArray[row][column] === "O" &&
        _gridCell.firstChild === null
      ) {
        _gamePieceRender.setAttribute("src", _gamePieceO.getAttribute("src"));
        _gridCell.appendChild(_gamePieceRender);
      }
    });
  };

  const _addToGameBoard = function (_gridCellEvent) {
    const cellRow = +_gridCellEvent.target.getAttribute("data-row");
    const cellColumn = +_gridCellEvent.target.getAttribute("data-column");

    // HACK: condition 1 checks if the cell is free,
    // condition 2 checks if the game has started; see: GameStartReset._startGame
    if (
      _gameBoardArray[cellRow][cellColumn] === 0 &&
      _gridCellEvent.target.classList.contains("enabled")
    ) {
      _gameBoardArray[cellRow].splice(cellColumn, 1, _currentGamePiece);

      _render();

      if (
        _moveCount >= MINIMUM_MOVE_COUNT_TO_WIN &&
        _checkWinCondition(cellRow, cellColumn)
      ) {
        console.log(
          `${_currentGamePiece} wins; winning move: [row: ${cellRow}, col: ${cellColumn}]`
        );
        // console.log(`movecount: ${_moveCount}`);
        console.table(_gameBoardArray);
        _signalThatMatchFinished(`${_currentGamePiece}`);
      }
      if (_moveCount === MAXIMUM_MOVE_COUNT) {
        console.log("Game draw");
        _signalThatMatchFinished("draw");
      }
      _toggleCurrentGamePiece();
    }
  };

  const _signalThatMatchFinished = function (winner) {
    // const _signalThatMatchFinished = function(winner, _newMatch) {
    if (winner === "X") {
      _scoreX++;
      _gameBanner.textContent = "X wins";
    } else if (winner === "O") {
      _scoreO++;
      _gameBanner.textContent = "O wins";
    }
    _gameScore.textContent = `X: [${_scoreX}]    O: [${_scoreO}] `;
    _sleep(2000);
    _newMatch();
  };

  const _newMatch = function () {
    _gridCells.forEach((gridCell) => {
      gridCell.classList.remove("enabled");
      if (gridCell.firstChild) {
        gridCell.removeChild(gridCell.firstChild);
      }
      if (gridCell.classList.contains("win")) {
        gridCell.classList.remove("win");
      }
    });
    Gameboard.init(_srcAssetX, _srcAssetO);
  };

  const _sleep = function (milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

  const _toggleCurrentGamePiece = function () {
    _currentGamePiece === "X"
      ? (_currentGamePiece = "O")
      : (_currentGamePiece = "X");
    _moveCount++;
  };

  const _checkWinCondition = function (i, j) {
    if (i === 1 && j === 1) {
      return _checkIfMiddleIsWinningMove();
    } else if (
      (i === 0 && j === 0) ||
      (i === 0 && j === 2) ||
      (i === 2 && j === 0) ||
      (i === 2 && j === 2)
    ) {
      return _checkIfCornerIsWinningMove(i, j);
    } else {
      return _checkIfEdgeIsWinningMove(i, j);
    }
  };

  const _checkIfMiddleIsWinningMove = function () {
    const i = 1;
    const j = 1;
    // to shorten the `if` condition block
    const gBA = _gameBoardArray;

    // |   |   |   |
    // |   | * |   |
    // |   |   |   |
    if (gBA[i][j] === gBA[i - 1][j - 1] && gBA[i][j] === gBA[i + 1][j + 1]) {
      // \
      _highlightWinningCells([i, j], [i - 1, j - 1], [i + 1, j + 1]);
      return true;
    } else if (gBA[i][j] === gBA[i][j - 1] && gBA[i][j] === gBA[i][j + 1]) {
      // |
      _highlightWinningCells([i, j], [i, j - 1], [i, j + 1]);
      return true;
    } else if (
      gBA[i][j] === gBA[i + 1][j - 1] &&
      gBA[i][j] === gBA[i - 1][j + 1]
    ) {
      // /
      _highlightWinningCells([i, j], [i + 1, j - 1], [i - 1, j + 1]);
      return true;
    } else if (gBA[i][j] === gBA[i - 1][j] && gBA[i][j] === gBA[i + 1][j]) {
      // --
      _highlightWinningCells([i, j], [i - 1, j], [i + 1, j]);
      return true;
    } else return false;
  };

  const _checkIfCornerIsWinningMove = function (i, j) {
    // to shorten the `if` condition block
    const gBA = _gameBoardArray;

    // | * |   |   |
    // |   |   |   |
    // |   |   |   |
    if (i === 0 && j === 0) {
      if (gBA[i][j] === gBA[i][j + 1] && gBA[i][j] === gBA[i][j + 2]) {
        // --
        _highlightWinningCells([i, j], [i, j + 1], [i, j + 2]);
        return true;
      } else if (
        gBA[i][j] === gBA[i + 1][j + 1] &&
        gBA[i][j] === gBA[i + 2][j + 2]
      ) {
        // \
        _highlightWinningCells([i, j], [i + 1, j + 1], [i + 2, j + 2]);
        return true;
      } else if (gBA[i][j] === gBA[i + 1][j] && gBA[i][j] === gBA[i + 2][j]) {
        // |
        _highlightWinningCells([i, j], [i + 1, j], [i + 2, j]);
        return true;
      }
    } // |   |   | * |
    // |   |   |   |
    // |   |   |   |
    else if (i === 0 && j === 2) {
      if (gBA[i][j] === gBA[i][j - 1] && gBA[i][j] === gBA[i][j - 2]) {
        // --
        _highlightWinningCells([i, j], [i, j - 1], [i, j - 2]);
        return true;
      } else if (
        gBA[i][j] === gBA[i + 1][j - 1] &&
        gBA[i][j] === gBA[i + 2][j - 2]
      ) {
        // /
        _highlightWinningCells([i, j], [i + 1, j - 1], [i + 2, j - 2]);
        return true;
      } else if (gBA[i][j] === gBA[i + 1][j] && gBA[i][j] === gBA[i + 2][j]) {
        // |
        _highlightWinningCells([i, j], [i + 1, j], [i + 2, j]);
        return true;
      }
    } // |   |   |   |
    // |   |   |   |
    // | * |   |   |
    else if (i === 2 && j === 0) {
      if (gBA[i][j] === gBA[i][j + 1] && gBA[i][j] === gBA[i][j + 2]) {
        // --
        _highlightWinningCells([i, j], [i, j + 1], [i, j + 2]);
        return true;
      } else if (
        gBA[i][j] === gBA[i - 1][j + 1] &&
        gBA[i][j] === gBA[i - 2][j + 2]
      ) {
        // /
        _highlightWinningCells([i, j], [i - 1, j + 1], [i - 2, j + 2]);
        return true;
      } else if (gBA[i][j] === gBA[i - 1][j] && gBA[i][j] === gBA[i - 2][j]) {
        // |
        _highlightWinningCells([i, j], [i - 1, j], [i - 2, j]);
        return true;
      }
    } // |   |   |   |
    // |   |   |   |
    // |   |   | * |
    else {
      if (gBA[i][j] === gBA[i][j - 1] && gBA[i][j] === gBA[i][j - 2]) {
        // --
        _highlightWinningCells([i, j], [i, j - 1], [i, j - 2]);
        return true;
      } else if (
        gBA[i][j] === gBA[i - 1][j - 1] &&
        gBA[i][j] === gBA[i - 2][j - 2]
      ) {
        // \
        _highlightWinningCells([i, j], [i - 1, j - 1], [i - 2, j - 2]);
        return true;
      } else if (gBA[i][j] === gBA[i - 1][j] && gBA[i][j] === gBA[i - 2][j]) {
        // |
        _highlightWinningCells([i, j], [i - 1, j], [i - 2, j]);
        return true;
      } else return false;
    }
  };

  const _checkIfEdgeIsWinningMove = function (i, j) {
    // to shorten the `if` condition block
    const gBA = _gameBoardArray;

    // |   |   |   |
    // | * |   |   |
    // |   |   |   |
    if (i === 1 && j === 0) {
      if (gBA[i][j] === gBA[i][j + 1] && gBA[i][j] === gBA[i][j + 2]) {
        // --
        _highlightWinningCells([i, j], [i, j + 1], [i, j + 2]);
        return true;
      } else if (gBA[i][j] === gBA[i - 1][j] && gBA[i][j] === gBA[i + 1][j]) {
        // |
        _highlightWinningCells([i, j], [i - 1, j], [i + 1, j]);
        return true;
      }
    } // |   | * |   |
    // |   |   |   |
    // |   |   |   |
    else if (i === 0 && j === 1) {
      if (gBA[i][j] === gBA[i][j - 1] && gBA[i][j] === gBA[i][j + 1]) {
        // --
        _highlightWinningCells([i, j], [i, j - 1], [i, j + 1]);
        return true;
      } else if (gBA[i][j] === gBA[i + 1][j] && gBA[i][j] === gBA[i + 2][j]) {
        // |
        _highlightWinningCells([i, j], [i + 1, j], [i + 2, j]);
        return true;
      }
    } // |   |   |   |
    // |   |   | * |
    // |   |   |   |
    else if (i === 1 && j === 2) {
      if (gBA[i][j] === gBA[i][j - 1] && gBA[i][j] === gBA[i][j - 2]) {
        // --
        _highlightWinningCells([i, j], [i, j - 1], [i, j - 2]);
        return true;
      } else if (gBA[i][j] === gBA[i - 1][j] && gBA[i][j] === gBA[i + 1][j]) {
        // |
        _highlightWinningCells([i, j], [i - 1, j], [i + 1, j]);
        return true;
      }
    } // |   |   |   |
    // |   |   |   |
    // |   | * |   |
    else {
      if (gBA[i][j] === gBA[i][j - 1] && gBA[i][j] === gBA[i][j + 1]) {
        // --
        _highlightWinningCells([i, j], [i, j - 1], [i, j + 1]);
        return true;
      } else if (gBA[i][j] === gBA[i - 1][j] && gBA[i][j] === gBA[i - 2][j]) {
        // |
        _highlightWinningCells([i, j], [i - 1, j], [i - 2, j]);
        return true;
      } else return false;
    }
  };

  const _highlightWinningCells = function (cell1, cell2, cell3) {
    const gridCell1 = doc.querySelector(
      `.tictacgrid[data-row="${cell1[0]}"][data-column="${cell1[1]}"]`
    );
    const gridCell2 = doc.querySelector(
      `.tictacgrid[data-row="${cell2[0]}"][data-column="${cell2[1]}"]`
    );
    const gridCell3 = doc.querySelector(
      `.tictacgrid[data-row="${cell3[0]}"][data-column="${cell3[1]}"]`
    );
    gridCell1.classList.add("win");
    gridCell2.classList.add("win");
    gridCell3.classList.add("win");
    return;
  };

  return {
    init,
  };
})(document || documentMock);

const GameStartReset = (function (doc) {
  "use strict";

  let _popupWindow;
  let _startGameButton;
  let _resetGameButton;
  let _gridCells;
  let _gameBanner;

  const init = function (srcX, srcO) {
    _cacheDOM();
    Gameboard.init(srcX, srcO);
  };

  const _cacheDOM = function () {
    _popupWindow = doc.querySelector(".popup");
    _startGameButton = doc.querySelector(".popup > button");
    _resetGameButton = doc.querySelector(".container > :last-child");
    _gameBanner = doc.querySelector(".gamebanner");
    _gridCells = doc.querySelectorAll(".tictacgrid");
    _resetGameButton.classList.add("hidden");
    _initializeGame();
  };

  const _initializeGame = function () {
    _gameBanner.textContent = "Hello player";

    _startGameButton.addEventListener("click", () => {
      _popupWindow.classList.add("hidden");
      _resetGameButton.classList.remove("hidden");

      // HACK: the .enabled class is a toggle to see
      // if the gridCell will start rendering gamepieces
      _gridCells.forEach((gridCell) => {
        gridCell.classList.add("enabled");
      });
    });

    _resetGameButton.addEventListener("click", () => {
      _resetGame();
    });
  };

  const _resetGame = function () {
    _popupWindow.classList.remove("hidden");
    _resetGameButton.classList.add("hidden");

    _gridCells.forEach((gridCell) => {
      gridCell.classList.remove("enabled");
      if (gridCell.firstChild) {
        gridCell.removeChild(gridCell.firstChild);
      }
      if (gridCell.classList.contains("win")) {
        gridCell.classList.remove("win");
      }
    });
    gameLoop();
  };

  return {
    init,
  };
})(document || documentMock);

// NOTE: Main game loop
const gameLoop = function () {
  const srcCross = "./../images/assets/sword.svg";
  const srcCircle = "./../images/assets/shield.svg";

  GameStartReset.init(srcCross, srcCircle);
  // Gameboard.init(srcCross, srcCircle);
};
gameLoop();
