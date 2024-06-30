const playBtn = document.querySelectorAll('.boutton');
function player(name, choice) {
    this.name = name;
    this.choice = choice;
}

const player1 = new player("Ahmed", "X");
const player2 = new player("Sami", "O");
document.addEventListener('DOMContentLoaded', (e) => {
    console.log(e);
    document.body.classList.add("active-popUp");
});

const gameboard = {  board : [],
    initializeBoard : function(){
        this.board = new Array(9).fill('');
        const cards=document.querySelectorAll('.card');
        cards.forEach((card)=>{card.textContent = ""});
    },
    displayBoard : function(){ //for the console check
        for (let i = 0; i < 9; i += 3) {
            console.log(this.board.slice(i, i + 3).join(' | '));
            if (i < 6) console.log('--+---+--');
        }
    },
    makeMove : function(index, move){
        if(this.board[index] === ''){
            this.board[index] = move;
            console.log("move maked");
            gameboard.displayBoard();
            return true;
        }else{
            console.log('that box Is BOOKED');
            return false;
        }
    }
};
const game ={
    currentPlayer : player1,
    vsComputer: false,
    switchPlayer : function (){
        if (this.currentPlayer === player1) {
            this.currentPlayer = player2;
        } else {
            this.currentPlayer = player1;
        }
    },
    checkForWin : function () {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], 
            [0, 3, 6], [1, 4, 7], [2, 5, 8], 
            [0, 4, 8], [2, 4, 6]              
        ];
        for (let condition of winConditions) {
            const [a, b, c] = condition;
            if (gameboard.board[a] !== '' && 
                gameboard.board[a] === gameboard.board[b] && 
                gameboard.board[a] === gameboard.board[c]) {
                return true; 
            }
        }
        return false; 
    },
    checkForTie: function() {
        return gameboard.board.every(cell => cell !== '') && !this.checkForWin();
    },
    playRound : function (card,index) {  //index is the blasa li 5tarha el joueur;
        if (gameboard.board[index]===""){
            if(gameboard.makeMove(index, this.currentPlayer.choice)){
                card.innerHTML = this.currentPlayer.choice;
                gameboard.displayBoard(); // dislpay on the console
                if (this.checkForWin()){
                    this.displayScore();
                    gameboard.initializeBoard();
                }else if (this.checkForTie()){
                    gameboard.initializeBoard();
                }else {
                    this.switchPlayer();
                    if (this.vsComputer && this.currentPlayer === player2) {
                        this.computerMove();
                    }
                };
            };
        };
    },
    computerMove: function() {
        const bestMove = this.minmax(gameboard.board, player2.choice);
        const card = document.querySelector(`[data-index="${bestMove.index}"]`);
        gameboard.makeMove(bestMove.index, player2.choice);
        card.innerHTML = player2.choice;
        if (this.checkForWin()) {
            this.displayScore();
            this.switchPlayer();
            gameboard.initializeBoard();
        } else if (this.checkForTie()) {
            alert("It's a Tie! Try Again.");
            gameboard.initializeBoard();
        } else {
            this.switchPlayer();
        }
    },
    minmax: function(newBoard, player) {
        const availSpots = newBoard.reduce((acc, curr, idx) => {
            if (curr === '') acc.push(idx);
            return acc;
        }, []);
        
        if (this.checkWin(newBoard, player1.choice)) {
            return {score: -10};
        } else if (this.checkWin(newBoard, player2.choice)) {
            return {score: 10};
        } else if (availSpots.length === 0) {
            return {score: 0};
        }

        const moves = [];
        for (let i = 0; i < availSpots.length; i++) {
            const move = {};
            move.index = availSpots[i];
            newBoard[availSpots[i]] = player;

            if (player === player2.choice) {
                const result = this.minmax(newBoard, player1.choice);
                move.score = result.score;
            } else {
                const result = this.minmax(newBoard, player2.choice);
                move.score = result.score;
            }

            newBoard[availSpots[i]] = '';
            moves.push(move);
        }

        let bestMove;
        if (player === player2.choice) {
            let bestScore = -10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        //console.log(moves[bestMove]);
        return moves[bestMove];
    },
    checkWin: function(board, player) {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], 
            [0, 3, 6], [1, 4, 7], [2, 5, 8], 
            [0, 4, 8], [2, 4, 6]
        ];
        for (let condition of winConditions) {
            const [a, b, c] = condition;
            if (board[a] === player && board[b] === player && board[c] === player) {
                return true;
            }
        }
        return false;
    },
    displayScore : function(){
        //function to diplay the game score
        //initialisation a 0:
        const PlayerChoice = this.currentPlayer.choice;
        const selector = `.${PlayerChoice.toLowerCase()}`;
        const scoreElement = document.querySelector(selector);
        let currentScore = Number(scoreElement.textContent);
        scoreElement.textContent = currentScore + 1;

    }
};
playBtn.forEach(bt =>{
    bt.addEventListener('click',()=>{
    gameboard.initializeBoard();
    const cards = document.querySelectorAll('.card');
    cards.forEach((card)=>{
        card.addEventListener('click',()=>{
            console.log(game.currentPlayer);
            game.playRound(card,card.dataset.index);
        })
    });
});
})

//pop up handler
const computer = document.getElementById('computer');
const human = document.getElementById('human');
human.addEventListener('click', ()=>{
    //playing vs human
    game.vsComputer = false;
    document.body.classList.remove("active-popUp");
    gameboard.initializeBoard();
    const cards = document.querySelectorAll('.card');
    cards.forEach((card)=>{
        card.addEventListener('click',()=>{
            console.log(game.currentPlayer);
            game.playRound(card,card.dataset.index);
        })
    });
});
computer.addEventListener('click', ()=>{
    //playing vs Computer
    game.vsComputer = true;
    document.body.classList.remove("active-popUp");
    gameboard.initializeBoard();
    const cards = document.querySelectorAll('.card');
    cards.forEach((card)=>{
        card.addEventListener('click',()=>{
            console.log(game.currentPlayer);
            game.playRound(card,card.dataset.index);
        })
    });
})