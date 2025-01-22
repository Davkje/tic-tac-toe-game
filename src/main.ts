import "../style/style.scss";

const boxes = document.querySelectorAll<HTMLDivElement>(".box");
const messageElement = document.getElementById("gameMessage") as HTMLDivElement;
const playAgainButton = document.getElementById("playAgainButton") as HTMLButtonElement;
const statusElement = document.getElementById("gameStatus") as HTMLDivElement;
let currentPlayer: "X" | "O" = "X";
const board = Array(9).fill(null);

// Add click listeners to all boxes
boxes.forEach((box) => box.addEventListener("click", handleClick));

// Add click listener for the "Play Again" button
playAgainButton.addEventListener("click", resetGame);

// Update the handleClick function
function handleClick(event: Event) {
	const target = event.target as HTMLDivElement;
	const index = parseInt(target.id.replace("box", "")) - 1;

	// Check if the box is already filled
	if (board[index] || checkWin()) return;

	// Update the board and UI
	board[index] = currentPlayer;
	target.innerHTML = getPlayerIcon(currentPlayer);

	// Add the "checked" class
	target.classList.add("checked");

	// Check for a win or switch players
	const winningCombo = checkWin();
	if (winningCombo) {
		highlightWinningBoxes(winningCombo);
		updateGameStatus("Winner");
		updateMessage(`${currentPlayer}`);
		showPlayAgainButton();
	} else if (board.every((cell) => cell)) {
		updateGameStatus("Draw");
		updateMessage(`${getPlayerIcon("X")} ${getPlayerIcon("O")}`);
		showPlayAgainButton();
	} else {
		currentPlayer = currentPlayer === "X" ? "O" : "X";
		updateGameStatus("Current Player");
		updateMessage(`${currentPlayer}`);
	}
}

// Update the resetGame function
function resetGame() {
	// Clear the board array
	board.fill(null);

	// Reset the UI for all boxes
	boxes.forEach((box) => {
		box.innerHTML = ""; // Clear the content
		box.classList.remove("checked"); // Remove the "checked" class
		box.classList.remove("winner"); // Remove the "winner" class
	});

	// Reset the current player and game message
	currentPlayer = "X";
	updateGameStatus("Current Player");
	updateMessage("X");

	// Hide the "Play Again" button
	hidePlayAgainButton();
}

function checkWin(): number[] | null {
	const winningCombos = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	for (const combo of winningCombos) {
		if (combo.every((index) => board[index] === currentPlayer)) {
			return combo; // Return the winning combination
		}
	}
	return null; // No winning combination
}

function highlightWinningBoxes(combo: number[]) {
	combo.forEach((index) => {
		const box = boxes[index];
		box.classList.add("winner");
	});
}

function updateMessage(message: string) {
	const playerIcon = currentPlayer === "X" ? getPlayerIcon("X") : getPlayerIcon("O");
	messageElement.innerHTML = message.replace(currentPlayer, playerIcon);
}

function showPlayAgainButton() {
	playAgainButton.classList.remove("hidden");
}

function hidePlayAgainButton() {
	playAgainButton.classList.add("hidden");
}

// Helper function to get icon HTML with specific classes
function getPlayerIcon(player: "X" | "O"): string {
	const playerClass = player === "X" ? "x-symbol" : "o-symbol";
	return `<span class="material-icons ${playerClass}">${player === "X" ? "close" : "radio_button_unchecked"}</span>`;
}

function updateGameStatus(status: "Current Player" | "Winner" | "Draw") {
	if (status === "Current Player") {
		statusElement.innerHTML = `
        <div>Player turn</div>
      `;
	} else if (status === "Winner") {
		statusElement.innerHTML = `
        <div>Winner!</div>
      `;
	} else if (status === "Draw") {
		statusElement.innerHTML = `
        <div>Draw!</div>
      `;
	}
}

// Initialize the message
updateGameStatus("Current Player");
updateMessage("X");
