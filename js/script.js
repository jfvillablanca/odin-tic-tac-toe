// TODO:
// - Create module for: gameBoard
// - Create factory function for: Player
// -------------------------------------
// - Game loop:
// 1. Assign X or O to both players. player1 = Player("Alice","X"), player2 = Player("Bob","O");
// 2. Determine whose turn it is and toggle after each move of the player
// 3. Gameboard.placePiece(playerNum) 
// -------------------------------------
// - Low prio: Initialize tictacgrid in Gameboard.init() instead of using HTML.

const documentMock = (() => ({
  querySelector: (_selector) => ({
    textContent: null,
  }),
}))();

const Gameboard = (function (doc) {
  "use strict";

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
    _render();
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
    [..._gridCells].map((_gridCell) => {
      const row = +_gridCell.getAttribute("data-row");
      const column = +_gridCell.getAttribute("data-column");
      const _gamePieceRender = doc.createElement("img");
      
      if (_gameBoardArray[row][column] === "X" && _gridCell.firstChild === null) {
        _gamePieceRender.setAttribute("src", _gamePieceX.getAttribute("src"));
        console.log(_gridCell);
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
    _currentGamePiece,
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

  const player1 = Player("Alice", "X");
  const player2 = Player("Bob", "O");
  
  Gameboard.init(srcCross, srcCircle);

  // HACK: Testing gamePiece render toggle
  let playerToggle = false;
  // for(let i=0; i<9; i++) {
  //   if (!playerToggle) {
  //     console.log(`${player1.playerName}'s turn`)
  //   } else {
  //     console.log(`${player2.playerName}'s turn`)
  //   }
  //
  //
  //
  //   if (i%2 === 0){
  //     Gameboard.curGamePiece = "X";
  //     console.log(Gameboard.curGamePiece);
  //   }
  //   else {
  //     Gameboard.curGamePiece = "O";
  //     console.log(Gameboard.curGamePiece);
  //   }
  // }
};

gameLoop();
