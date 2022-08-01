var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';

var GAMER_IMG = '<img src="img/gamer.png" />';
var BALL_IMG = '<img src="img/ball.png" />';

var gBoard;
var gGamerPos;
var gInter
var gGamerBallCount = 0
var gMaxBalls = 10

function initGame() {
    gGamerPos = { i: 2, j: 9 };
    gBoard = buildBoard();
    renderBoard(gBoard);
    getEmptyCells(gBoard)
}


function buildBoard() {
    // Create the Matrix
    var board = createMat(10, 12)

    // Put FLOOR everywhere and WALL at edges
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            // Put FLOOR in a regular cell
            var cell = { type: FLOOR, gameElement: null };

            // Place Walls at edges
            if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
                cell.type = WALL;
                if ((i === 0 && j === 5) || (i === 5 && j === 0) || (i === 9 && j === 5) || (i === 5 && j === 11))
                    cell.type = FLOOR

            }

            // Add created cell to The game board
            board[i][j] = cell;
        }
    }


    // Place the gamer at selected position
    board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

    // Place the Balls (currently randomly chosen positions)

    gInter = setInterval(function ballsies() {
        var cols = getRandomNum(1, 9)
        var rows = getRandomNum(1, 11)
        if (gGamerBallCount === gMaxBalls)
            showRestart()

        if (!(cols === gGamerPos.i && rows === gGamerPos.j)) {
            if (gGamerBallCount < gMaxBalls) {
                gBoard[cols][rows].gameElement = BALL;
                renderBoard(gBoard)

            }
        }
    }, 1000)

    return board;
}

// Render the board to an HTML table
function renderBoard(board) {

    var strHTML = '';

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];

            var cellClass = getClassName({ i: i, j: j })

            // TODO - change to short if statement
            if (currCell.type === FLOOR) cellClass += ' floor';
            else if (currCell.type === WALL) cellClass += ' wall';

            strHTML += `\t<td class="cell ${cellClass}"  onclick="moveTo(${i}, ${j})" >\n`;

            // TODO - change to switch case statement
            if (currCell.gameElement === GAMER) {
                strHTML += GAMER_IMG;
            } else if (currCell.gameElement === BALL) {
                strHTML += BALL_IMG;
            }

            strHTML += '\t</td>\n';
        }
        strHTML += '</tr>\n';
    }

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {
    var updateBallBox = document.querySelector('.ballCounterBox')
    var targetCell = gBoard[i][j];

    if (targetCell.type === WALL) return;

    // Calculate distance to make sure we are moving to a neighbor cell
    var iAbsDiff = Math.abs(i - gGamerPos.i);
    var jAbsDiff = Math.abs(j - gGamerPos.j);

    // If the clicked Cell is one of the four allowed
    if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {

        if (targetCell.gameElement === BALL) {
            var audio = new Audio('audio/ball.wav')
            audio.play();
            gGamerBallCount++
            updateBallBox.innerText = `Balls collected: ${gGamerBallCount}`
            console.log(`Balls collected: ${gGamerBallCount}`);
        }


        // MOVING from current position
        // Model:
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
        // Dom:
        renderCell(gGamerPos, '');

        // MOVING to selected position
        // Model:
        gGamerPos.i = i;
        gGamerPos.j = j;
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
        // DOM:
        renderCell(gGamerPos, GAMER_IMG);

    } // else console.log('TOO FAR', iAbsDiff, jAbsDiff);

}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector);
    elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {

    var i = gGamerPos.i;
    var j = gGamerPos.j;

    // if ((i===0 && j===5) || (i===5 && j===0) || (i===9 && j===5) || (i===5 && j===11))


    switch (event.key) {
        case 'ArrowLeft':
            if (gGamerPos.i == 5 && gGamerPos.j == 0) {
                gGamerPos.i = 5
                gGamerPos.j = 11

                break
            }
            else
                moveTo(i, j - 1);
            break;
        case 'ArrowRight':
            if (gGamerPos.i == 5 && gGamerPos.j == 11) {
                gGamerPos.i = 5
                gGamerPos.j = 0
                break
            }
            else
                moveTo(i, j + 1);
            break;
        case 'ArrowUp':
            if (gGamerPos.i == 0 && gGamerPos.j == 5) {
                gGamerPos.i = 9
                gGamerPos.j = 5
                break
            }
            else
                moveTo(i - 1, j);
            break;
        case 'ArrowDown':
            if (gGamerPos.i == 9 && gGamerPos.j == 5) {
                gGamerPos.i = 0
                gGamerPos.j = 5
                break
            }
            else
                moveTo(i + 1, j);
            break;
    }

}


function getEmptyCells() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            console.log('Cells')
        }
    }
}

// Returns the class name for a specific cell
function getClassName(location) {
    var cellClass = `cell-${location.i}-${location.j}`;
    return cellClass;
}

function showRestart() {
    var elButton = document.querySelector('button')

    elButton.style.display = 'block'
}
function stopGame() {
    var updateBallBox = document.querySelector('.ballCounterBox')
    var elButton = document.querySelector('button')
    elButton.style.display = 'none'
    gGamerBallCount = 0
    updateBallBox.innerText = 'Balls collected: '
    clearInterval(gInter)
    initGame()
}