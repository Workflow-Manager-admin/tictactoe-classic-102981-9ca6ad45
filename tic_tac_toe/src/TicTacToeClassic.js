import React, { useState } from "react";

/**
 * Color palette and theme, per requirements.
 */
const COLORS = {
  primary: "#ffffff",
  secondary: "#222222",
  accent: "#4caf50",
  border: "#dddddd",
  x: "#222222",     // Assign symbol colors for contrast
  o: "#4caf50",     // accent
  win: "#4caf50",
  draw: "#888888"
};

// Style objects for the container and elements
const boardContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: COLORS.primary,
  borderRadius: 12,
  boxShadow: "0 2px 16px 0 rgba(0,0,0,0.05)",
  padding: "32px 20px 24px",
  maxWidth: 340,
  margin: "48px auto 0 auto"
};

const titleStyle = {
  fontWeight: "bold",
  fontSize: "1.85rem",
  marginBottom: 14,
  color: COLORS.secondary,
  textAlign: "center"
};

const turnStyle = {
  fontSize: "1rem",
  marginBottom: 8,
  color: COLORS.accent,
  fontWeight: 500
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 64px)",
  gridTemplateRows: "repeat(3, 64px)",
  gap: "8px"
};

const cellBtnStyle = {
  width: 64,
  height: 64,
  fontSize: "2.4rem",
  fontWeight: 700,
  border: `2px solid ${COLORS.border}`,
  borderRadius: 8,
  background: COLORS.primary,
  color: COLORS.secondary,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background 0.1s, border 0.1s"
};

const statusStyle = {
  fontSize: "1.08rem",
  marginTop: 22,
  marginBottom: 10,
  minHeight: 28,
  fontWeight: 500,
  color: COLORS.secondary,
  textAlign: "center"
};

const resetBtnStyle = {
  marginTop: 6,
  background: COLORS.accent,
  color: "#fff",
  border: "none",
  borderRadius: 4,
  padding: "10px 20px",
  fontWeight: 600,
  fontSize: "1rem",
  cursor: "pointer",
  transition: "background 0.2s"
};

const winCellStyle = {
  background: "#eafcf0", // light accent background for winning cells
  border: `2px solid ${COLORS.accent}`
};

// All possible win lines (0-indexed board)
const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6]             // diags
];

// PUBLIC_INTERFACE
function TicTacToeClassic() {
  /**
   * This is the main container React component for the Tic Tac Toe Classic game
   */

  // Board is an array of 9: null/'X'/'O'
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true); // X always starts
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null); // 'X', 'O', or null
  const [winLine, setWinLine] = useState([]); // Winning cell indices (for highlighting)

  // Handle cell click
  // PUBLIC_INTERFACE
  function handleClick(idx) {
    if (gameOver || board[idx]) return; // Ignore if finished or cell taken
    const newBoard = board.slice();
    newBoard[idx] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    const winInfo = checkWinner(newBoard);
    if (winInfo.winner) {
      setGameOver(true);
      setWinner(winInfo.winner);
      setWinLine(winInfo.line);
    } else if (newBoard.every((c) => c)) {
      setGameOver(true);
      setWinner(null); // Draw
      setWinLine([]);
    } else {
      setXIsNext((prev) => !prev);
    }
  }

  // PUBLIC_INTERFACE
  function checkWinner(bd) {
    for (let line of WIN_LINES) {
      const [a, b, c] = line;
      if (
        bd[a] &&
        bd[a] === bd[b] &&
        bd[a] === bd[c]
      ) {
        return { winner: bd[a], line };
      }
    }
    return { winner: null, line: [] };
  }

  // PUBLIC_INTERFACE
  function resetGame() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setGameOver(false);
    setWinner(null);
    setWinLine([]);
  }

  // UI helpers
  function renderCell(idx) {
    const value = board[idx];
    let symbolColor =
      value === "X"
        ? COLORS.x
        : value === "O"
        ? COLORS.o
        : COLORS.secondary;

    let style = { ...cellBtnStyle, color: symbolColor };
    if (winLine.includes(idx)) {
      style = { ...style, ...winCellStyle, color: COLORS.accent };
    }

    return (
      <button
        key={idx}
        style={style}
        onClick={() => handleClick(idx)}
        aria-label={`cell ${idx + 1}: ${value || "empty"}`}
        disabled={!!board[idx] || gameOver}
        tabIndex={0}
      >
        {value}
      </button>
    );
  }

  function displayStatus() {
    if (winner && winner === "X")
      return (
        <span style={{ color: COLORS.win }}>
          Player 1 (<b>X</b>) wins!
        </span>
      );
    if (winner && winner === "O")
      return (
        <span style={{ color: COLORS.win }}>
          Player 2 (<b>O</b>) wins!
        </span>
      );
    if (gameOver && !winner)
      return <span style={{ color: COLORS.draw }}>It's a draw!</span>;
    return null;
  }

  return (
    <div style={boardContainerStyle} data-testid="tictactoe-container">
      <div style={titleStyle}>Tic Tac Toe Classic</div>
      <div style={turnStyle}>
        {gameOver ? (
          ""
        ) : (
          <>
            Turn:
            <span
              style={{
                color: xIsNext ? COLORS.x : COLORS.o,
                fontWeight: "bold",
                marginLeft: 6
              }}
            >
              {xIsNext ? "Player 1 (X)" : "Player 2 (O)"}
            </span>
          </>
        )}
      </div>
      <div style={gridStyle} role="grid" aria-label="Tic Tac Toe Grid">
        {[...Array(9)].map((_, idx) => renderCell(idx))}
      </div>
      <div style={statusStyle}>{displayStatus()}</div>
      <button
        style={resetBtnStyle}
        onClick={resetGame}
        aria-label="Reset Game"
        tabIndex={0}
      >
        Reset Game
      </button>
    </div>
  );
}

export default TicTacToeClassic;
