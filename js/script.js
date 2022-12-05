// TODO:
// - Create module for: gameBoard
// - Create factory function for: Player
// -------------------------------------
// - Game loop:
// 1. Assign X or O to both players. player1 = Player("Alice","X"), player2 = Player("Bob","O");
// 2. Determine whose turn it is and toggle after each move of the player
// 3. Gameboard.placePiece(playerNum)
// -------------------------------------
// - Gameboard.
// - asdj
// -------------------------------------

const documentMock = (() => ({
  querySelector: (_selector) => ({
    textContent: null,
  }),
}))();

const Gameboard = (function (doc) {
  "use strict";
  // NOTE: It takes 5 moves to win the game. 
  // Example: If player 1 tries to win ASAP and player 2 plays ignorantly.
  const MINIMUM_MOVE_COUNT_TO_WIN = 5;
  let _currentGamePiece = "X";
  let _gridCells = null;
  let _gamePieceX = null;
  let _gamePieceO = null;
  const _gameBoardArray = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  const init = function(srcX, srcO) {
    _cacheDOM(srcX, srcO);
  }

  const _cacheDOM = function(srcX, srcO) {
    _gamePieceX = doc.createElement("img");
    _gamePieceX.setAttribute("src", srcX);
    _gamePieceO = doc.createElement("img");
    _gamePieceO.setAttribute("src", srcO);
    _gridCells = doc.querySelectorAll(".tictacgrid");

    _gridCells.forEach((_gridCell) => {
      _gridCell.addEventListener("click", _addToGameBoard);
    });
  }

  const _render = function() {
    [..._gridCells].forEach((_gridCell) => {
      const row = +_gridCell.getAttribute("data-row");
      const column = +_gridCell.getAttribute("data-column");
      const _gamePieceRender = doc.createElement("img");
      
      if (_gameBoardArray[row][column] === "X" && _gridCell.firstChild === null) {
        _gamePieceRender.setAttribute("src", _gamePieceX.getAttribute("src"));
        _gridCell.appendChild(_gamePieceRender);
      } else if (_gameBoardArray[row][column] === "O" && _gridCell.firstChild === null) {
        _gamePieceRender.setAttribute("src", _gamePieceO.getAttribute("src"));
        _gridCell.appendChild(_gamePieceRender);
      } 
    });
  }

  const _addToGameBoard = function(_gridCellEvent) {
    const cellRow = +_gridCellEvent.target.getAttribute("data-row");
    const cellColumn = +_gridCellEvent.target.getAttribute("data-column");
    if (_gameBoardArray[cellRow][cellColumn] === 0) {
      _gameBoardArray[cellRow].splice(cellColumn, 1, _currentGamePiece);
      _render();
      _toggleCurrentGamePiece();
    } 
  }

  const _toggleCurrentGamePiece = function() {
    _currentGamePiece === "X" ? _currentGamePiece = "O" : _currentGamePiece = "X";
  }

  return {
    init,
  }
})(document || documentMock);

const Player = function (playerName, gamePiece) {
  "use strict";
  return {
    playerName,
    gamePiece,
  };
};

const gameLoop = function () {
  // NOTE: Main game loop
  const srcCross = "./../images/assets/sword.svg";
  const srcCircle = "./../images/assets/shield.svg";

  Gameboard.init(srcCross, srcCircle);

  const player1 = Player("Alice", "X");
  const player2 = Player("Bob", "O");

}
gameLoop();
