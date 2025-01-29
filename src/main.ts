import "../style/style.scss";

const boxes = document.querySelectorAll<HTMLDivElement>(".box");
const messageElement = document.getElementById("gameMessage") as HTMLDivElement;
const playAgainButton = document.getElementById("playAgainButton") as HTMLButtonElement;
const statusElement = document.getElementById("gameStatus") as HTMLDivElement;
let currentPlayer: "X" | "O" = "X";
const board = Array(9).fill(null);

//THEME TOGGLE
const themeButton = document.getElementById("themeButton") as HTMLButtonElement;
let isDarkMode = false;

// Add click listener for the theme button
themeButton.addEventListener("click", () => {
	isDarkMode = !isDarkMode; // Toggle dark mode state
	playRandomClickSound();

	// Update body class to switch themes
	if (isDarkMode) {
		document.body.classList.add("dark-mode");
		themeButton.textContent = "dark_mode"; // Change the button text/icon to moon
	} else {
		document.body.classList.remove("dark-mode");
		themeButton.textContent = "light_mode"; // Change the button text/icon to sun
	}
});

// ------------ AUDIO ------------------

const volumeSlider = document.getElementById("volumeSlider") as HTMLInputElement;
const volumeLabel = document.getElementById("volumeLabel") as HTMLLabelElement;

const winSound = new Audio("./sounds/win_sound.wav");
const drawSound = new Audio("./sounds/draw_sound.wav");
const music = new Audio("./sounds/music.wav");
const clickSounds = [new Audio("sounds/click_1.wav"), new Audio("sounds/click_2.wav"), new Audio("sounds/click_3.wav"), new Audio("sounds/click_4.wav"), new Audio("sounds/click_5.wav")];

let previousVolume = parseFloat(volumeSlider.value); // Keep track of previous volume

// Function to play the background music after user interaction
function startMusic() {
	music.loop = true; // Ensure it loops
	playSound(music); // Use your existing wrapper to respect mute state
	document.removeEventListener("click", startMusic); // Remove the listener after starting
}

// INITIAL VOLUME FOR ALL SOUNDS
const allAudioElements = [music, winSound, drawSound, ...clickSounds];
allAudioElements.forEach((audio) => {
	audio.volume = parseFloat(volumeSlider.value); // Initialize to slider value
});

// Handle volume slider input
volumeSlider.addEventListener("change", () => { 
	const volume = parseFloat(volumeSlider.value);
	allAudioElements.forEach((audio) => {
		audio.volume = volume;
	});

	// Update the icon based on volume
	volumeLabel.textContent = volume === 0 ? "volume_off" : "volume_up";
});

// Handle click on volume label for mute/unmute
volumeLabel.addEventListener("click", () => {
	if (parseFloat(volumeSlider.value) > 0) {
		// Save current volume and mute
		previousVolume = parseFloat(volumeSlider.value);
		volumeSlider.value = "0";
		volumeLabel.textContent = "volume_off";
	} else {
		// Restore previous volume and unmute
		volumeSlider.value = previousVolume.toString();
		volumeLabel.textContent = "volume_up";
	}

	// Apply the new volume to all audio elements
	const volume = parseFloat(volumeSlider.value);
	allAudioElements.forEach((audio) => {
		audio.volume = volume;
	});
});

function playRandomClickSound() {
	const randomIndex = Math.floor(Math.random() * clickSounds.length);
	const sound = clickSounds[randomIndex];
	sound.currentTime = 0; // Reset to the start
	sound.play();
}

// Wrapper function to play sound respecting the mute state
function playSound(sound: HTMLAudioElement) {
	sound.currentTime = 0;
	sound.play();
}

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
	playRandomClickSound();
	// Add the "checked" class
	target.classList.add("checked");

	// Check for a win or switch players
	const winningCombo = checkWin();
	if (winningCombo) {
		highlightWinningBoxes(winningCombo);
		updateGameStatus("Winner");
		updateMessage(`${currentPlayer}`);
		showPlayAgainButton();
		playSound(winSound);
	} else if (board.every((cell) => cell)) {
		updateGameStatus("Draw");
		updateMessage(`${getPlayerIcon("X")} ${getPlayerIcon("O")}`);
		showPlayAgainButton();
		playSound(drawSound);
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
	playRandomClickSound();

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
document.addEventListener("click", startMusic);
