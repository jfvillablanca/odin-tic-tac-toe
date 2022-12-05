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
  // Example: If player 1 tries to win ASAP and player 2 plays ignorantly,
  // player 1 wins after placing their piece 3 times.
  const MINIMUM_MOVE_COUNT_TO_WIN = 5;
  const MAXIMUM_MOVE_COUNT = 9;
  // the _moveCount starts at 1 since increment happens on _toggleCurrentGamePiece()
  let _moveCount = 1;
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
      if (_moveCount >= MINIMUM_MOVE_COUNT_TO_WIN) {
        if (_checkWinCondition(cellRow, cellColumn)) {
          console.log(`${_currentGamePiece} wins: row: ${cellRow}, col: ${cellColumn}`);
          console.log(`movecount: ${_moveCount}`);
          console.table(_gameBoardArray);
        }
      }
      if (_moveCount === MAXIMUM_MOVE_COUNT) {
        console.log("Game draw");
      }
      _toggleCurrentGamePiece();
    } 
  }

  const _checkWinCondition = function (i, j) {
    if (i === 1 && j === 1) {
      return _checkIfMiddleIsWinningMove();
    } else if ((i === 0 && j === 0) ||
               (i === 0 && j === 2) ||
               (i === 2 && j === 0) || 
               (i === 2 && j === 2)) {
      return _checkIfCornerIsWinningMove(i, j);
    } else {
      return _checkIfEdgeIsWinningMove(i, j);
    } 
  }

  const _checkIfMiddleIsWinningMove = function() {
    const i = 1;
    const j = 1;
    // to shorten the `if` condition block
    const gBA = _gameBoardArray;
    
    // |   |   |   |
    // |   | * |   |
    // |   |   |   |
    if ((gBA[i][j] === gBA[i-1][j-1] && gBA[i][j] === gBA[i+1][j+1])   ||     // \
        (gBA[i][j] === gBA[i][j-1]   && gBA[i][j] === gBA[i][j+1])     ||     // |
        (gBA[i][j] === gBA[i+1][j-1] && gBA[i][j] === gBA[i-1][j+1])   ||     // /
        (gBA[i][j] === gBA[i-1][j]   && gBA[i][j] === gBA[i+1][j]))     {     // --
      return true;
    } else return false;
  }

  const _checkIfCornerIsWinningMove = function(i, j) {
    // to shorten the `if` condition block
    const gBA = _gameBoardArray;
    
    // | * |   |   |
    // |   |   |   |
    // |   |   |   |
    if (i === 0 && j === 0) {
      if ((gBA[i][j] === gBA[i][j+1]   && gBA[i][j] === gBA[i][j+2])   ||     // --
          (gBA[i][j] === gBA[i+1][j+1] && gBA[i][j] === gBA[i+2][j+2]) ||     // \
          (gBA[i][j] === gBA[i+1][j]   && gBA[i][j] === gBA[i+2][j]))   {     // |
        return true;
      }  
    } 
    // |   |   | * |
    // |   |   |   |
    // |   |   |   |
    else if (i === 0 && j === 2) {
      if ((gBA[i][j] === gBA[i][j-1]   && gBA[i][j] === gBA[i][j-2])   ||     // --
          (gBA[i][j] === gBA[i+1][j-1] && gBA[i][j] === gBA[i+2][j-2]) ||     // / 
          (gBA[i][j] === gBA[i+1][j]   && gBA[i][j] === gBA[i+2][j]))   {     // |
        return true;
      }  
    } 
    // |   |   |   |
    // |   |   |   |
    // | * |   |   |
    else if (i === 2 && j === 0) {
      if ((gBA[i][j] === gBA[i][j+1]   && gBA[i][j] === gBA[i][j+2])   ||     // --
          (gBA[i][j] === gBA[i-1][j+1] && gBA[i][j] === gBA[i-2][j+2]) ||     // / 
          (gBA[i][j] === gBA[i-1][j]   && gBA[i][j] === gBA[i-2][j]))   {     // |
        return true;
      }  
    } 
    // |   |   |   |
    // |   |   |   |
    // |   |   | * |
    else {
      if ((gBA[i][j] === gBA[i][j-1]   && gBA[i][j] === gBA[i][j-2])   ||     // --
          (gBA[i][j] === gBA[i-1][j-1] && gBA[i][j] === gBA[i-2][j-2]) ||     // \
          (gBA[i][j] === gBA[i-1][j]   && gBA[i][j] === gBA[i-2][j]))   {     // |
        return true;
      } else return false;  
    }
  }

  const _checkIfEdgeIsWinningMove = function(i, j) {
    // to shorten the `if` condition block
    const gBA = _gameBoardArray;
    
    // |   |   |   |
    // | * |   |   |
    // |   |   |   |
    if (i === 1 && j === 0) {
      if ((gBA[i][j] === gBA[i][j+1]   && gBA[i][j] === gBA[i][j+2])   ||     // --
          (gBA[i][j] === gBA[i-1][j]   && gBA[i][j] === gBA[i+1][j]))   {     // |
        return true;
      }  
    } 
    // |   | * |   |
    // |   |   |   |
    // |   |   |   |
    else if (i === 0 && j === 1) {
      if ((gBA[i][j] === gBA[i][j-1]   && gBA[i][j] === gBA[i][j+1])   ||     // --
          (gBA[i][j] === gBA[i+1][j]   && gBA[i][j] === gBA[i+2][j]))   {     // |
        return true;
      }  
    } 
    // |   |   |   |
    // |   |   | * |
    // |   |   |   |
    else if (i === 1 && j === 2) {
      if ((gBA[i][j] === gBA[i][j-1]   && gBA[i][j] === gBA[i][j+1])   ||     // --
          (gBA[i][j] === gBA[i-1][j]   && gBA[i][j] === gBA[i+1][j]))   {     // |
        return true;
      }  
    } 
    // |   |   |   |
    // |   |   |   |
    // |   | * |   |
    else {
      if ((gBA[i][j] === gBA[i][j-1]   && gBA[i][j] === gBA[i][j+1])   ||     // --
          (gBA[i][j] === gBA[i-1][j]   && gBA[i][j] === gBA[i-2][j]))   {     // |
        return true;
      } else return false;  
    } 
  }

  const _toggleCurrentGamePiece = function() {
    _currentGamePiece === "X" ? _currentGamePiece = "O" : _currentGamePiece = "X";
    _moveCount++;
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
