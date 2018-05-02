function  GenerateWinCombination(numCilinder, numPlayingSymbPerCilinder, totalSymb) {

    this.numCilinder = numCilinder;
    this.numPlayingSymbPerCilinder = numPlayingSymbPerCilinder;
    this.totalSymb = totalSymb;

    this.totalRound = 0;

    this.bet = 10;

    this.totalScore = 250250;

    this.numSymbline = [ 0, 0, 0, 0, 0 ];

    this.numWinSymbline = [ 0, 0, 0, 0, 0 ];

    this.firstSymbline = [ 0, 0, 0, 0, 0 ];

    this.winLineNum = 5;

    this.stopPositionArray = [];

    this.payTable = [
        [  0 ,  25 ,  100 , 1000 , 5000 ], // SYMB_Seven
        [  0 ,  25 ,   50 ,  200 ,  500 ], // SYMB_Diamond
        [  0 ,  25 ,   50 ,  100 ,  200 ], // SYMB_Dice
        [  0 ,  25 ,   50 ,  100 ,  200 ], // SYMB_Bar
        [  0 ,  25 ,   50 ,  100 ,  200 ], // SYMB_Bell
        [  0 ,  25 ,   50 ,  100 ,  200 ], // SYMB_Coins
        [  0 ,  25 ,   50 ,  100 ,  200 ], // SYMB_Horseshoe
        [  0 ,  25 ,   50 ,  100 ,  200 ], // SYMB_Crown
        [  0 ,  25 ,   50 ,  100 ,  200 ], // SYMB_Clover
        [  0 ,  15 ,   30 ,  100 ,  120 ], // SYMB_Cherry
        [  0 ,  25 ,   50 ,  200 ,  500 ], // SYMB_Grapes
        [  0 ,  25 ,   50 ,  100 ,  200 ], // SYMB_Strawberry
    ];

    this.r = [
        [ 3, 3, 3, 2, 0, 2, 2, 7, 5, 5, 6, 6, 6, 5, 5, 5, 1, 1, 4, 1, 4, 4, 4, 3, 0 ],
        [ 3, 3, 3, 3, 4, 4, 4, 2, 4, 2, 2, 5, 0, 5, 5, 5, 1, 1, 0, 1, 6, 6, 6, 6, 7 ],
        [ 3, 3, 3, 2, 2, 6, 2, 5, 5, 5, 0, 5, 6, 6, 6, 7, 4, 4, 4, 0, 4, 1, 1, 3, 1 ],
        [ 3, 3, 3, 1, 1, 0, 4, 4, 4, 4, 0, 4, 3, 3, 7, 2, 2, 5, 5, 5, 6, 5, 6, 6, 6 ],
        [ 3, 3, 3, 5, 5, 5, 1, 1, 4, 7, 4, 4, 4, 7, 4, 3, 3, 5, 0, 6, 6, 6, 2, 2, 0 ]
    ];
  /*  this.r = [
        [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3 ],
        [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3 ],
        [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3 ],
        [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3 ],
        [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3 ]
    ];*/
   /* this.r = [
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
    ];*/

    this.arrayCombination = [];
    for (var j = 0; j < this.numCilinder; j++ ) {
        this.arrayCombination[j]=[];
    }
    this.winLineArray = [];
    for (var j = 0; j < this.winLineNum; j++ ) {
        this.winLineArray[j]=[];
    }

    this.moveArray = [];
    for (var j = 0; j < this.winLineNum; j++ ) {
            this.moveArray[j] = [
                []
            ];
    }

    for (var j = 0; j < this.winLineNum; j++ ) {
        for (var k = 0; k < this.numCilinder; k++ ) {
          this.moveArray[j][k] = [0, 0, 0];
        }
    }
  //  console.log("123", this.moveArray);
}

GenerateWinCombination.prototype.constructor = GenerateWinCombination;

function randomInteger(min, max) {
    var rand = min + Math.random() * (max - min);
    rand = Math.floor(rand);
    return rand;
}

GenerateWinCombination.prototype.generate = function() {

    for (var j = 0; j < this.numCilinder; j++ ) {
        var stopPosition = randomInteger(0, this.r[0].length - 1);
        this.stopPositionArray[j] = stopPosition;
        for (var i = 0; i < this.numPlayingSymbPerCilinder; i++ ) {
            this.arrayCombination[j][i] = this.r[j][(stopPosition > 0) ? stopPosition + i - 1 : (i > 0) ? stopPosition + i - 1 : this.r[0].length - 1 ];
        }
    }

    console.log("stopPositionArray", this.stopPositionArray);
    this.winLine(this.arrayCombination);
    this.winlineRound();
    this.moveWinLine();
    return this.arrayCombination;
};

GenerateWinCombination.prototype.winLine = function(arrayCombination) {
    this.arrayCombination = arrayCombination;
    for (var j = 0; j < this.winLineNum; j++ ) {
        if (j == 0) {
            for (var i = 0; i < this.numCilinder; i++) {
                this.winLineArray[j][i] = this.arrayCombination[i][1];
            }
        } else if (j == 1) {
            for (var i = 0; i < this.numCilinder; i++) {
                this.winLineArray[j][i] = this.arrayCombination[i][0];
            }
        } else if (j == 2) {
            for (var i = 0; i < this.numCilinder; i++) {
                this.winLineArray[j][i] = this.arrayCombination[i][2];
            }
        } else if (j == 3) {
            for (var i = 0; i < this.numCilinder; i++) {
                this.winLineArray[j][i] = this.arrayCombination[i][i];
            }
        } else if (j == 4) {
            for (var i = 0; i < this.numCilinder; i++) {
                this.winLineArray[j][i] = this.arrayCombination[i][(i == 0) ? 2 : (i == 2) ? 0 : 1];
            }
        }
    }
    console.log("this.winLineArray", this.winLineArray);
};

GenerateWinCombination.prototype.winlineRound = function() {

    for (var j = 0; j < this.winLineNum; j++ ) {
        if (j == 0) {
            for (var i = 0; i < this.numCilinder; i++) {
                if (i > 0) {
                    if (this.winLineArray[j][i] == this.winLineArray[j][i - 1] && this.winLineArray[j][i] == this.firstSymbline[j]) {
                        this.numSymbline[j] ++;
                    } else {
                        break;
                    }
                } else if (i == 0) {
                    this.numSymbline[j] = 0;
                    this.firstSymbline[j] = this.winLineArray[j][i];
                }
            }
        } else if (j == 1) {
            for (var i = 0; i < this.numCilinder; i++) {
                if (i > 0) {
                    if (this.winLineArray[j][i] == this.winLineArray[j][i - 1] && this.winLineArray[j][i] == this.firstSymbline[j]) {
                        this.numSymbline[j] ++;
                    } else {
                        break;
                    }
                } else if (i == 0) {
                    this.numSymbline[j] = 0;
                    this.firstSymbline[j] = this.winLineArray[j][i];
                }
            }
        } else if (j == 2) {
            for (var i = 0; i < this.numCilinder; i++) {
                if (i > 0) {
                    if (this.winLineArray[j][i] == this.winLineArray[j][i - 1] && this.winLineArray[j][i] == this.firstSymbline[j]) {
                        this.numSymbline[j] ++;
                    } else {
                        break;
                    }
                } else if (i == 0) {
                    this.numSymbline[j] = 0;
                    this.firstSymbline[j] = this.winLineArray[j][i];
                }
            }
        } else if (j == 3) {
            for (var i = 0; i < this.numCilinder; i++) {
                if (i > 0) {
                    if (this.winLineArray[j][i] == this.winLineArray[j][i - 1] && this.winLineArray[j][i] == this.firstSymbline[j]) {
                        this.numSymbline[j] ++;
                    } else {
                        break;
                    }
                } else if (i == 0) {
                    this.numSymbline[j] = 0;
                    this.firstSymbline[j] = this.winLineArray[j][i];
                }
            }
        } else if (j == 4) {
            for (var i = 0; i < this.numCilinder; i++) {
                if (i > 0) {
                    if (this.winLineArray[j][i] == this.winLineArray[j][i - 1] && this.winLineArray[j][i] == this.firstSymbline[j]) {
                        this.numSymbline[j] ++;
                    } else {
                        break;
                    }
                } else if (i == 0) {
                    this.numSymbline[j] = 0;
                    this.firstSymbline[j] = this.winLineArray[j][i];
                }
            }
        }
    }
   // console.log("this.firstSymbline", this.firstSymbline);
   // console.log("this.numSymbline", this.numSymbline);
};

GenerateWinCombination.prototype.moveWinLine = function() {

    for (var j = 0; j < this.moveArray.length; j++) {
        for (var i = 0; i < this.moveArray[0].length; i++)
        {
            if (j == 0 && this.payTable[this.firstSymbline[j]][this.numSymbline[j]] > 0) {
                this.moveArray[j][i] = [0, (i <= this.numSymbline[j] && this.numSymbline[j] > 0) ? 1 : 0, 0];
                this.numWinSymbline[j] = 1;
            } else if (j == 1 && this.payTable[this.firstSymbline[j]][this.numSymbline[j]]) {
                this.moveArray[j][i] = [(i <= this.numSymbline[j] && this.numSymbline[j] > 0) ? 1 : 0, 0, 0];
                this.numWinSymbline[j] = 1;
            } else if (j == 2 && this.payTable[this.firstSymbline[j]][this.numSymbline[j]]) {
                this.moveArray[j][i] = [0, 0, (i <= this.numSymbline[j] && this.numSymbline[j] > 0) ? 1 : 0];
                this.numWinSymbline[j] = 1;
            } else if (j == 3 && this.payTable[this.firstSymbline[j]][this.numSymbline[j]]) {
                this.moveArray[j][i] = [
                    (i == 0 && this.numSymbline[j] > 0 && i <= this.numSymbline[j]) ? 1 : 0,
                    (i == 1 && this.numSymbline[j] > 0 && i <= this.numSymbline[j]) ? 1 : 0,
                    (i == 2 && this.numSymbline[j] > 0 && i <= this.numSymbline[j]) ? 1 : 0
                ];
                this.numWinSymbline[j] = 1;
            } else if (j == 4 && this.payTable[this.firstSymbline[j]][this.numSymbline[j]]) {
                this.moveArray[j][i] = [
                    (i == 2 && this.numSymbline[j] > 0 && i <= this.numSymbline[j]) ? 1 : 0,
                    (i == 1 && this.numSymbline[j] > 0 && i <= this.numSymbline[j]) ? 1 : 0,
                    (i == 0 && this.numSymbline[j] > 0 && i <= this.numSymbline[j]) ? 1 : 0
                ];
                this.numWinSymbline[j] = 1;
            } else {
                this.moveArray[j][i] = [ 0, 0, 0 ];
                this.numWinSymbline[j] = 0;
            }
        }
    }
   /* this.moveArray[1] = [
        [1,0,0],
        [1,0,0],
        [1,0,0],
        [1,0,0],
        [1,0,0]
    ];
    this.moveArray[2] = [
        [0,0,1],
        [0,0,1],
        [0,0,1],
        [0,0,1],
        [0,0,1]
    ];
    this.moveArray[3] = [
            [1,0,0],
            [0,1,0],
            [0,0,1],
            [0,1,0],
            [1,0,0]
        ];
     this.moveArray[4] = [
            [0,0,1],
            [0,1,0],
            [1,0,0],
            [0,1,0],
            [0,0,1]
        ];*/

    console.log("this.moveArray", this.moveArray);
    console.log("this.numWinSymbline", this.numWinSymbline);
};

GenerateWinCombination.prototype.getNumSymbline = function() {
    return this.numSymbline;
};

GenerateWinCombination.prototype.getMoveArray = function() {
    return this.moveArray;
};

GenerateWinCombination.prototype.getWinlineRound = function() {
    return this.numWinSymbline;
};

GenerateWinCombination.prototype.getTotalRound = function() {
    for (var i = 0; i < this.numSymbline.length; i++) {
        this.totalRound += this.payTable[this.firstSymbline[i]][this.numSymbline[i]];
    }
    return this.totalRound * (this.bet / 10.0);
};

GenerateWinCombination.prototype.setTotalRound = function(num) {
    this.totalRound = num;
};

GenerateWinCombination.prototype.setBet = function(num) {
    this.bet = num;
};

GenerateWinCombination.prototype.getBet = function() {
   return this.bet;
};

GenerateWinCombination.prototype.getTotalScore = function() {
    return this.totalScore;
};

GenerateWinCombination.prototype.setTotalScore = function(num) {
    this.totalScore = num;
    console.log("totalScore", this.totalScore);
};

  /*[  0 ,  0 ,  100 , 1000 , 5000 ], // SYMB_Seven
    [  0 ,  0 ,   50 ,  200 ,  500 ], // SYMB_Diamond
    [  0 ,  0 ,   50 ,  200 ,  500 ], // SYMB_Grapes
    [  0 ,  0 ,   20 ,   50 ,  200 ], // SYMB_Bar
    [  0 ,  0 ,   20 ,   50 ,  200 ], // SYMB_Bell
    [  0 ,  0 ,   20 ,   50 ,  200 ], // SYMB_Strawberry
    [  0 ,  5 ,   20 ,   50 ,  200 ], // SYMB_Cherry
    [  0 ,  0 ,    2 ,   10 ,   50 ], // SYMB_Crown
    [  0 ,  0 ,    2 ,   10 ,   50 ], // SYMB_Clover
    [  0 ,  0 ,    2 ,   10 ,   50 ], // SYMB_Horseshoe
    [  0 ,  0 ,    2 ,   10 ,   50 ], // SYMB_Dice
    [  0 ,  0 ,    2 ,   10 ,   50 ], // SYMB_Coins
    [  0 ,  0 ,    2 ,   10 ,   50 ]  // SYMB_Dice*/