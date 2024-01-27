const playBtn = document.getElementById('play');
function player(name, choice) {
    this.name = name;
    this.choice = choice;
}
const player1 = new player(prompt('Player 1 name ? (X)'),"X");
const player2 = new player(prompt("Player 2 name ? (O)"),"O");
//const player1 = new player("ahmed","X");
//const player2 = new player("sami","O");
const gameboard = {  board : [],
    initializeBoard : function(){
        this.board = new Array(9).fill('')
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
            return true;
        }else{
            document.getElementById("remarque").innerHTML = 'that box Is BOOKED';
            
        }
    }
};
const game ={
    currentPlayer : player1,
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
    checkForTie : function (){
        for (let cell of gameboard.board) {
            if (cell === '') {
                return false; 
            }
        }
        return !game.checkForWin();
    },
    playRound : function (card,index) {  //index is the blasa li 5tarha el joueur;
        if (gameboard.board[index]===""){
            if(gameboard.makeMove(index, this.currentPlayer.choice)){
                card.innerHTML = this.currentPlayer.choice;
                gameboard.displayBoard();
                if (this.checkForWin()){
                    console.log(`atha ${this.currentPlayer.name} rBa7`);
                    gameboard.initializeBoard();
                }else if (this.checkForTie()){
                    alert("it's a Tie Try Again");
                    gameboard.initializeBoard();
                };
                this.switchPlayer();
            document.getElementById('player').innerHTML = "Current Player is "+game.currentPlayer.name.toUpperCase();
            }else{
                console.log('the Ídfasdadfad');
            }
        }
    }
};
playBtn.addEventListener('click',()=>{
    gameboard.initializeBoard();
    const crads = document.querySelectorAll('.card');
    crads.forEach((card)=>{
        card.addEventListener('click',()=>{
            console.log(game.currentPlayer);
            game.playRound(card,card.dataset.index);
            
        })
    });
});