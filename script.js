var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
	document.querySelector(".endgame").style.display = "none";
	//Fancy way of saying the board is every number from 0=>9
	origBoard = Array.from(Array(9).keys());
	//Go through every cell and clear the color of the squares in case user restarts, and use TurnClick fn listener
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

//Turn switching
function turnClick(square) {
	//If the square hasn't been clicked
	if (typeof origBoard[square.target.id] == 'number')
	{
		//Setup(action, actionTaker)
		turn(square.target.id, huPlayer)
		//If its not a tie, computer's turn
		if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) => 
		(e === player) ? a.concat(i) : a, []);
	//if no1 won, game gameWon=null
	let gameWon = null;
	//Check if current index has a win condition
	for (let [index, win] of winCombos.entries()) {
		//For every element - check is plays is more than -1 [Has the player played in every spot that counts as a win]
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			//someone won , so gameWon != -1
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	//Pass the winning game combo into the function for highlighting
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			//If the player won the game - then blue, if not red
			gameWon.player == huPlayer ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		//Remove event listener
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "You Win" : "You Lose");
}

function emptySquares() {
	//Finds empty squares
	return origBoard.filter(s => typeof s == 'number');
}

//Declares winner
function declareWinner(who) {

	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;

}

//AI spot
function bestSpot() {
	// return emptySquares()[0];
	//Returns best spot from minimax algo
	return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
	//If every square is filled up and no1 has won - then TIE
	if (emptySquares().length == 0) 
	{
		// For each square , color and turn off listener
		for (var i = 0; i < cells.length; i++) 
		{
			//Sets background coor
			cells[i].style.backgroundColor = "green";
			//Removes event listener
			cells[i].removeEventListener('click', turnClick, false);
		}
		//Declare winner - true
		declareWinner("Tie Game!");
		return true;
	}

}


function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

/*
*
*		Minimax Algo - recursive function
*
*		1. return a value if a terminal state is found (+10, 0, -10)
*		2. go through available spots on the board
*		3. call the minimax function on each available spot (recursion)
*		4. evaluate returning values from function calls.
*		5. and return the best value
*
*
*/

function minimax(newBoard, player) {

	//Empty Squares 
	var availSpots = emptySquares(newBoard);


	//Terminal States
	if (checkWin(newBoard, huPlayer)) //If '0' wins
	{
		return {score: -10};
	} 
	else if (checkWin(newBoard, aiPlayer)) //If 'X' win
	{
		return {score: 10};
	} 
	else if (availSpots.length === 0) //No room to play, game is a tie
	{
		return {score: 0};
	}


	//Collect scores of each empty spot to eval(), basically looping through every single space to determine the best move
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		//Set old index to new index.property
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		/*
		*
		*		Recursion method - calls itself with different boards
		*
		*/

		//Set empty spot to new player
		if (player == aiPlayer) 
		{
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} 
		else 		//Keeps going deeper into recursion until found a state
		{
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		//Pushes move and resets board to previous board
		newBoard[availSpots[i]] = move.index;
		moves.push(move);

	}

	//Finds the highest score when AI is player, lowest when Human is player
	var bestMove;
	if(player === aiPlayer) 
	{
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) 
		{
			if (moves[i].score > bestScore) 
			{
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} 
	else 
	{
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) 
		{
			if (moves[i].score < bestScore)
			{
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	//Returns best object
	return moves[bestMove];
}