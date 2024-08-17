const apiUrl = "https://your-render-app-url/api/tictactoe";
let board = [];
let gameOver = false;

document.addEventListener("DOMContentLoaded", () => {
    createBoard();
    getStatus();
});

function createBoard() {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener("click", () => makeMove(i, j));
            boardElement.appendChild(cell);
        }
    }
}

async function getStatus() {
    const response = await fetch(`${apiUrl}/status`);
    const data = await response.json();
    board = data.board;
    gameOver = data.gameOver;
    updateBoard();
    if (data.winner !== ' ') {
        document.getElementById("message").innerText = `Player ${data.winner} wins!`;
    } else if (gameOver) {
        document.getElementById("message").innerText = "It's a draw!";
    }
}

function updateBoard() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        const row = cell.dataset.row;
        const col = cell.dataset.col;
        cell.innerText = board[row][col];
    });
}

async function makeMove(row, col) {
    if (gameOver || board[row][col] !== '\0') return;
    const response = await fetch(`${apiUrl}/move?row=${row}&col=${col}`, {
        method: 'POST'
    });
    if (response.ok) {
        getStatus();
    } else {
        alert("Invalid move!");
    }
}

async function restartGame() {
    await fetch(`${apiUrl}/restart`, {
        method: 'POST'
    });
    document.getElementById("message").innerText = '';
    getStatus();
}
