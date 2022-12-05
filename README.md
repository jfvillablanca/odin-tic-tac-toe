# This is a basic browser-based tic tac toe game for [The Odin Project](https://www.theodinproject.com/).
This project uses [Skeleton](https://github.com/dhg/Skeleton) for boilerplate

## Requirements
- The main goal is to use module patterns and factory functions.
    - There are no global variables in the script.js and all modules use strict mode.
- Gameboard session is stored in an array.
- Player and game loop is also stored as an object.
- Logic on the 3-in-a-row win condition or a draw.
- Misc: Start/Restart Game and display winner of the game
- Optional: add a basic AI

## What is the logic in the script?
1. Inside the gameLoop() function, the Gameboard module is initialized with the init() method.  
2. The `.svg` of the game piece (the "X"s and "O"s) can be changed by with changing the values of `srcCross` and `srcCircle` to the respective relative file path. 
3. The file paths of the `.svg` would be passed to the init() method which the Gameboard will use as the asset of the game piece.
4. Inside the init() is _cacheDOM() method.
5. _cacheDOM() does two things:
    - create elements for the game piece assets.
    - would query select all grid cells then add event listeners to each.
6. The callback function for the event listeners is the _addToGameBoard() private method.
7. The callback does these things:
    1. Get the `data-row` and `data-column` of the triggered cell.
    2. Splice the _currentGamePiece to the respective _gameBoardArray index.
    3. Invoke _render() to paint the DOM.
    4. check for win or draw condition.
    5. Switch the current game piece.
8. _checkWinCondition() does these things:
    1. If the currently added piece is in row: 1, col: 1 (middle of the board), check if win,
    2. else if, the currently added piece is in row: 0, col: 0 OR ... (corners of the board), check if win,
    3. else, the currently added piece is in row: 1, col: 0 OR ... (edges of the board), check if win.
    4. If no win condition AND _moveCount === 9 (max no. of moves), then game is draw.
