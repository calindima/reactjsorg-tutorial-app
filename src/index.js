import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const boardSize = this.props.boardSize;
    const board = [];
    for (let i = 0; i < boardSize; i++) {
      const rows = [];
      for (let j = i * boardSize; j < (i + 1) * boardSize; j++) {
        rows.push(this.renderSquare(j));
      }
      board.push(
        <div key={`row-${i + 1}`} className="board-row">
          {rows}
        </div>
      );
      console.log(board);
    }
    return <div>{board}</div>;
  }
}

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      boardSize: 3,
      history: [
        {
          squares: Array(9).fill(null),
          lastSquareClicked: null,
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {
          squares: squares,
          lastSquareClicked: i,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const status = winner
      ? `Winner : ${winner}`
      : `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;

    const moves = history.map((step, move, stepArr) => {
      const col = (step.lastSquareClicked % this.state.boardSize) + 1;
      const row = Math.floor(step.lastSquareClicked / this.state.boardSize) + 1;

      const desc = move
        ? `Go to move #${move} - Row: ${row}, Column: ${col}`
        : `Go to game start`;
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            className={move === this.state.stepNumber ? 'bold' : ''}
          >
            {desc}
          </button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            boardSize={this.state.boardSize}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// Helper functions
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
