import "../style/style.scss";



const boxes = document.querySelectorAll<HTMLDivElement>(".box");
const messageElement = document.getElementById("gameMessage") as HTMLDivElement;
const playAgainButton = document.getElementById("playAgainButton") as HTMLButtonElement;
let currentPlayer: "X" | "O" = "X";
const board = Array(9).fill(null);

// Add click listeners to all boxes
boxes.forEach((box) => box.addEventListener("click", handleClick));

// Add click listener for the "Play Again" button
playAgainButton.addEventListener("click", resetGame);

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
	if (checkWin()) {
		updateMessage(`${currentPlayer}`);
		showPlayAgainButton();
	} else if (board.every((cell) => cell)) {
		updateMessage("It's a draw!");
		showPlayAgainButton();
	} else {
		currentPlayer = currentPlayer === "X" ? "O" : "X";
		updateMessage(`${currentPlayer}`);
	}
}

function resetGame() {
	board.fill(null);
	boxes.forEach((box) => {
		box.innerHTML = "";
		box.classList.remove("checked"); // Remove the "checked" class
	});
	currentPlayer = "X";
	updateMessage("X");
	hidePlayAgainButton();
}

function checkWin(): boolean {
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

	return winningCombos.some((combo) => combo.every((index) => board[index] === currentPlayer));
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

// Initialize the message
updateMessage("X");
