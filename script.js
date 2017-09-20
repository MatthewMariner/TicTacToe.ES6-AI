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

function turnClick(square) {
	turn(square.target.id, huPlayer)
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
}

