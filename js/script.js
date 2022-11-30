// TODO:
// - Create module for: gameBoard
// - Create factory function for: Player
// -------------------------------------
//
const documentMock = (() => ({
  querySelector: (_selector) => ({
    textContent: null,
  }),
}))();

const Gameboard = (function (doc) {
  "use strict";

  let _gamePieceX = null;
  let _gamePieceO = null;
  const init = function(srcX, srcO){
    _gamePieceX = doc.createElement("img"); 
    _gamePieceX.setAttribute("src", srcX);
    _gamePieceO = doc.createElement("img"); 
    _gamePieceO.setAttribute("src", srcO);
  };

  const _listenerCallback = function (e) {
    e.target.classList.toggle("green");
  };

  const addListenerToDivGrid = function (gridCellSelector) {
    const gridCells = doc.querySelectorAll(gridCellSelector);

    gridCells.forEach((gridCell) => {
      gridCell.addEventListener("click", _listenerCallback);
    });
  };

  return {
    addListenerToDivGrid,
  };
})(document || documentMock);

const assetFactory = function (name, tag, src) {
  "use strict";

  return {
    name,
    tag,
    src,
  };
};

const Player = function(playerName, gamePiece) {
  return {
    playerName,
    gamePiece,
  };
};

(function () {
  // NOTE: Main game loop
  const srcCross = "./../images/assets/sword.svg";
  const srcCircle = "./../images/assets/shield.svg";

  const player1 = Player("Alice", "X");
  const player2 = Player("Bob", "O");
  
  Gameboard.init(srcCross, srcCircle);
  Gameboard.addListenerToDivGrid(".tictacgrid");
})();
