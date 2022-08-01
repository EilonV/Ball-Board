//Create matrix
function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

//Get random number with range
function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  