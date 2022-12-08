// TODO:
// / Game reset
// / Fix reset game
// / DOM popup winner/draw (not  popup, gamebanner update instead)
// / Scores
// - Player choose their game piece
// / Display whose turn it is (Partial)
// / Highlight winning cells
// / Prettify the game board in css
// / Rebase the branch back to main
// / Refactor HACK of checking if gridcellenabled,
// use another way of indicating if game has activated

const documentMock = (() => ({
  querySelector: (_selector) => ({
    textContent: null,
  }),
}))();

const Gameboard = (function (doc) {
  "use strict";

  // NOTE: Element selectors
  let _popupWindow;
  let _buttonStartGame;
  let _buttonResetGame;
  let _gameBanner;
  let _gameScore;
  let _gameboard;
  let _gridCells;
  let _gamePieceX;
  let _gamePieceO;
  let _buttonNextMatch;

  // NOTE: Game variables
  let _srcAssetX;
  let _srcAssetO;
  let _scoreX = 0;
  let _scoreO = 0;
  let _currentGamePiece = "X";
  const _gameBoardArray = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  // NOTE: It takes 5 moves to win the game.
  // Example: If player 1 tries to win ASAP and player 2 plays ignorantly,
  // player 1 wins after placing their piece 3 times.
  const MINIMUM_MOVE_COUNT_TO_WIN = 5;
  const MAXIMUM_MOVE_COUNT = 9;
  // the _moveCount starts at 1 since increment happens on _toggleCurrentGamePiece()
  let _moveCount = 1;

  const init = function (srcX, srcO) {
    _cacheDOM(srcX, srcO);
    _newGame();
    _newMatch();
  };

  const _cacheDOM = function (srcX, srcO) {
    _popupWindow = doc.querySelector(".popup");
    _buttonStartGame = doc.querySelector(".popup > button");
    _buttonResetGame = doc.querySelector(".container > :last-child");
    _gameBanner = doc.querySelector(".gamebanner");
    _gameScore = doc.querySelector(".score");
    _gameboard = doc.querySelector(".gameboard");

    _gridCells = doc.querySelectorAll(".tictacgrid");

    _srcAssetX = srcX;
    _srcAssetO = srcO;
    _gamePieceX = doc.createElement("img");
    _gamePieceX.setAttribute("src", _srcAssetX);
    _gamePieceO = doc.createElement("img");
    _gamePieceO.setAttribute("src", _srcAssetO);
    // _gameboard.classList.add("enabled");

    _buttonNextMatch = doc.querySelector(".nextmatch");
  };

  const _newGame = function () {
    _scoreX = 0;
    _scoreO = 0;
    _updateGameBanner("Hello player");
    _buttonResetGame.classList.add("hidden");

    _buttonStartGame.addEventListener("click", () => {
      _updateGameBanner();
      _popupWindow.classList.add("hidden");
      _gameboard.classList.add("enabled");
      _buttonResetGame.classList.remove("hidden");
    });

    _buttonResetGame.addEventListener("click", () => {
      _resetGame();
    });
  };

  const _newMatch = function () {
    _moveCount = 1;
    _currentGamePiece = "X";
    for (const row in _gameBoardArray) {
      _gameBoardArray[row] = [0, 0, 0];
    }
    _buttonNextMatch.parentNode.classList.add("hidden");

    _gridCells.forEach((_gridCell) => {
      _gridCell.addEventListener("click", _addToGameBoard);
    });
  };

  const _resetGame = function () {
    _popupWindow.classList.remove("hidden");
    _gameboard.classList.remove("enabled");
    _buttonResetGame.classList.add("hidden");

    _gridCells.forEach((gridCell) => {
      if (gridCell.firstChild) {
        gridCell.removeChild(gridCell.firstChild);
      }
      if (gridCell.classList.contains("win")) {
        gridCell.classList.remove("win");
      }
    });
    gameLoop();
  };

  const _render = function () {
    _updateGameBanner();
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

    if (
      _gameBoardArray[cellRow][cellColumn] === 0 &&
      _gameboard.classList.contains("enabled")
    ) {
      _gameBoardArray[cellRow].splice(cellColumn, 1, _currentGamePiece);

      _toggleCurrentGamePiece();
      _render();

      if (
        _moveCount >= MINIMUM_MOVE_COUNT_TO_WIN &&
        _checkWinCondition(cellRow, cellColumn)
      ) {
        console.log(
          `${_currentGamePiece} wins; winning move: [row: ${cellRow}, col: ${cellColumn}]`
        );
        console.table(_gameBoardArray);
        // Negate the _toggleCurrentGamePiece() to record the actual winner
        _toggleCurrentGamePiece();
        _signalThatMatchFinished(`${_currentGamePiece}`);
      } // Had to use > instead of === since _toggleCurrentGamePiece increments _moveCount early
      else if (_moveCount > MAXIMUM_MOVE_COUNT) {
        console.log("Game draw");
        _signalThatMatchFinished("draw");
      }
    }
  };

  const _signalThatMatchFinished = function (winner) {
    if (winner === "X") {
      _scoreX++;
      _updateGameBanner("X wins");
    } else if (winner === "O") {
      _scoreO++;
      _updateGameBanner("O wins");
    } else _updateGameBanner("Game draw");
    _gameboard.classList.remove("enabled");

    _buttonNextMatch.parentNode.classList.remove("hidden");
    _buttonNextMatch.addEventListener("click", () => {
      _gameboard.classList.add("enabled");
      _nextMatch();
    });
  };

  const _nextMatch = function () {
    _updateGameBanner();
    _gridCells.forEach((gridCell) => {
      gridCell.removeEventListener("click", _addToGameBoard);
      if (gridCell.firstChild) {
        gridCell.removeChild(gridCell.firstChild);
      }
      if (gridCell.classList.contains("win")) {
        gridCell.classList.remove("win");
      }
    });
    _newMatch();
  };

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

  const _updateGameBanner = function (announcement) {
    _gameBanner.textContent = announcement || `Your turn: ${_currentGamePiece}`;
    _gameScore.textContent = `X: [${_scoreX}]    O: [${_scoreO}] `;
  };

  return {
    init,
  };
})(document || documentMock);

// NOTE: Main game loop
const gameLoop = function () {
  const srcCross = "images/sword.svg";
  const srcCircle = "images/shield.svg";

  Gameboard.init(srcCross, srcCircle);
};
gameLoop();
