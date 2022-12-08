# This is a basic browser-based tic tac toe game for [The Odin Project](https://www.theodinproject.com/).
This project uses [Skeleton](https://github.com/dhg/Skeleton) for boilerplate

## Requirements
- The main goal is to use module patterns and factory functions.
    - There are no global variables in the script.js and all module(s) use strict mode.
- Gameboard session is stored in a private array.
- Gameboard is stored as a module.
- Logic on the 3-in-a-row win condition or a draw.
- Misc: Start/Restart Game and display winner of the game
- Optional: add a basic AI (Unimplemented)

## What is the logic in the script?
1. Inside the `gameLoop()` function, the Gameboard module is initialized with the `init()` method.  
2. The `.svg` of the game piece (the "X"s and "O"s) can be changed by with changing the values of `srcCross` and `srcCircle` to the respective relative file path. 
3. The file paths of the `.svg` would be passed to the `init()` method which the Gameboard will use as the asset of the game piece.

## What's inside the Gameboard module?
- NOTE: Tbh, the Gameboard became the whole gameloop itself. I got lost in the sauce and I am afraid to refactor to make the whole thing modular 😅

1. The actual game loop is as follows:
    1. A popup with a button: Start Game appears. On click, a new match occurs
    2. During the match, a button: Reset Game appears. On click, the main `gameLoop()` is called.
    3. On a win/draw, a button: Next Match appears. On click, a new match occurs, the score are retained.

2. `init()`, calls: `_cacheDOM()`, `_newGame()`, and `_newMatch()`
3. `_cacheDOM()`:
    - query select all DOM interactive DOM elements.
4. `_newGame`:
    - Greets the player with `_updateGameBanner`
    - Hide the reset button
    - Add event listener to button: Start Game
        - On click, hide popup Window, activate gameboard, show reset button
5. `_newMatch`:
    - reset `_moveCount` and `_gameBoardArray`, set `_currentGamePiece` to `"X"`
    - hide button: Next Match
    - add event listeners to all gameboard grid cells
6. `resetGame`:   
    - show popup window, hide button: Reset Game
    - disable gameboard
    - For each gridcell with a game piece asset appended as a child, remove child.
    - For each gridcell with a .win class (highlights the cell green), remove class
    - call `gameLoop()`
7. `_addToGameBoard`: (Callback function) Checking for win/draw occurs every time a `click` event happens.
    - The callback does these things:
        1. Get the `data-row` and `data-column` of the triggered cell.
        2. Splice the `_currentGamePiece` to the respective `_gameBoardArray` index.
        3. Switch the current game piece.
        4. Invoke `_render()` to paint the DOM.
        5. check for win or draw condition.
8. `_checkWinCondition`:
    1. If the currently added piece is in row: 1, col: 1 (middle of the board), check if win,
    2. else if, the currently added piece is in row: 0, col: 0 OR ... (corners of the board), check if win,
    3. else, the currently added piece is in row: 1, col: 0 OR ... (edges of the board), check if win.
    4. If win condition, highlight the winning cells.
    5. If no win condition AND `_moveCount` === 9 (max no. of moves), then game is draw.
9. `_render`:
    - Call `_updateGameBanner` to indicate whose turn it is.
    - Check the `_gameBoardArray`:
        - If cell is `"X"` AND no `.firstChild` exists (aka, the cell is blank), then append the `"X"` game piece asset.
        - Same with `"O"`.
