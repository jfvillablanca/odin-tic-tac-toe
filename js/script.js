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

const Gameboard = (function(doc){
  'use strict';

  const addListenerToDivGrid = function(gridCellSelector) {
    const gridCells = doc.querySelectorAll(gridCellSelector);

    const listenerCallback = function(e) {
      e.target.classList.toggle("green");
    }

    gridCells.forEach(gridCell => {
      gridCell.addEventListener("click", listenerCallback)
    });
  } 

  return {
    addListenerToDivGrid,
  }
})(document || documentMock);

(function(){
  // NOTE: Main game loop
  Gameboard.addListenerToDivGrid(".tictacgrid");
})();
