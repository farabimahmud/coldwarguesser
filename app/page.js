'use client';

import React, { useState, useEffect } from 'react';

// --- ICONS ---

// Game Piece Icons
const LeaderIcon = ({ team }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`w-10 h-10 ${team === 'Soviets' ? 'text-red-500' : 'text-blue-500'}`} fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>);
const FollowerIcon = ({ team }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`w-8 h-8 ${team === 'Soviets' ? 'text-red-700' : 'text-blue-700'}`} fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>);

// Tile Background Icons
const NatoCacheIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-blue-800 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const SovietCacheIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-red-800 opacity-20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>;
const EmptyCacheIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-600 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>;
const KillTileIcon = ({ word }) => {
    const icons = {
        glasnost: <path d="M19.14,12.35,12,19.5,4.86,12.35,3.41,13.76,12,22.34l8.59-8.58Z M12,2,3.41,10.59,4.86,12,12,4.83,19.14,12l1.41-1.41L12,2Z" />, // Stylized 'G'
        jfk: <path d="M12,8a4,4,0,1,0,4,4A4,4,0,0,0,12,8Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,14Z M21.9,10.73h-2V9.54a.5.5,0,0,0-.5-.5H18.27a.5.5,0,0,0-.5.5v1.19H16.58a.5.5,0,0,0-.5.5v1.19h-1.2V13.6a.5.5,0,0,0,.5.5h1.19v1.19a.5.5,0,0,0,.5.5H19.4a.5.5,0,0,0,.5-.5V14.1h1.19a.5.5,0,0,0,.5-.5V11.23A.5.5,0,0,0,21.9,10.73Z" />, // Crosshairs
        armageddon: <path d="M11.94,2A10,10,0,0,0,2,12a10,10,0,0,0,10,10,10,10,0,0,0,10-10A10,10,0,0,0,11.94,2Zm0,18a8,8,0,0,1-8-8,8,8,0,0,1,8-8,8,8,0,0,1,8,8A8,8,0,0,1,11.94,20Zm-1-5h2v2h-2Zm0-8h2v6h-2Z" /> // Biohazard
    };
    return <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-purple-800 opacity-25" viewBox="0 0 24 24" fill="currentColor">{icons[word]}</svg>;
};


// --- GAME CONSTANTS ---
const KILL_WORDS = {
    glasnost: { type: 'kill', target: 'Soviets' },
    jfk: { type: 'kill', target: 'NATO' },
    armageddon: { type: 'kill', target: 'any' }
};
const MAX_ROUNDS = 10;
const TEAMS = ['Soviets', 'NATO'];
const ROLES = ['Leader', 'Follower'];

// --- HELPER FUNCTIONS ---
const getShuffledWords = (list, count) => {
  const shuffled = [...list].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// --- MAIN GAME COMPONENT ---
export default function Game() {
  const [wordList, setWordList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playerRole, setPlayerRole] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [turn, setTurn] = useState(null);
  const [winner, setWinner] = useState(null);
  const [message, setMessage] = useState("");
  const [instructionInput, setInstructionInput] = useState("");

  useEffect(() => {
    fetch('/wordlist.txt')
      .then(response => response.ok ? response.text() : Promise.reject('Network response was not ok'))
      .then(text => {
        const words = text.split('\n').map(word => word.trim()).filter(word => word.length > 0);
        setWordList(words);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Failed to load word list:", error);
        setMessage("Error: Could not load game data. Please try refreshing the page.");
        setIsLoading(false);
      });
  }, []);

  const initializeGame = (selectedRole) => {
    if (wordList.length === 0) {
        setMessage("Word list is not available. Cannot start the game.");
        return;
    }
    setPlayerRole(selectedRole);
    
    const regularWords = getShuffledWords(wordList, 16 - Object.keys(KILL_WORDS).length);
    let tiles = [];

    for (const word in KILL_WORDS) {
        tiles.push({ word, reward: KILL_WORDS[word], piece: null, revealed: false });
    }

    let rewardTypes = ['good', 'good', 'good', 'bad', 'bad', ...Array(16 - tiles.length - 5).fill('none')];
    rewardTypes.sort(() => 0.5 - Math.random());

    regularWords.forEach(word => {
        const rewardType = rewardTypes.pop();
        tiles.push({
            word: word, piece: null, revealed: false,
            reward: rewardType === 'none' ? null : {
                type: rewardType,
                weapons: Math.floor(Math.random() * 5) + 1,
                cash: (Math.floor(Math.random() * 5) + 1) * 10,
            },
        });
    });

    tiles.sort(() => 0.5 - Math.random());
    const initialBoard = Array(4).fill(null).map((_, y) => Array(4).fill(null).map((_, x) => tiles[y * 4 + x]));

    const newGameState = {
      board: initialBoard,
      pieces: {
        Soviets: { Leader: { x: 0, y: 0, team: 'Soviets', role: 'Leader' }, Follower: { x: 0, y: 1, team: 'Soviets', role: 'Follower' } },
        NATO: { Leader: { x: 3, y: 3, team: 'NATO', role: 'Leader' }, Follower: { x: 3, y: 2, team: 'NATO', role: 'Follower' } },
      },
      scores: { Soviets: { weapons: 0, cash: 0 }, NATO: { weapons: 0, cash: 0 } },
      round: 1, currentInstruction: null, currentTeam: 'Soviets',
    };

    for (const team in newGameState.pieces) {
      for (const role in newGameState.pieces[team]) {
        const { x, y } = newGameState.pieces[team][role];
        newGameState.board[y][x].piece = newGameState.pieces[team][role];
      }
    }

    setGameState(newGameState);
    setTurn('Leader');
    setWinner(null);
    setMessage(`Round 1: Soviets Leader, give your instruction.`);
  };

  const processFollowerMove = (follower, newX, newY) => {
    let newGameState = JSON.parse(JSON.stringify(gameState));
    const { team } = follower;
    
    newGameState.board[follower.y][follower.x].piece = null;
    newGameState.board[newY][newX].piece = follower;
    newGameState.pieces[team].Follower.x = newX;
    newGameState.pieces[team].Follower.y = newY;

    const tile = newGameState.board[newY][newX];
    let moveMessage = `${team} Follower moved to '${tile.word}'. `;
    
    if (tile.reward && !tile.revealed) {
      const reward = tile.reward;
      
      if (reward.type === 'kill') {
          let leaderKilled = null;
          if (reward.target === 'any' || reward.target === team) leaderKilled = team;
          
          if(leaderKilled){
              const winnerTeam = leaderKilled === 'Soviets' ? 'NATO' : 'Soviets';
              setWinner(winnerTeam);
              setMessage(`'${tile.word}' was a trap! The ${leaderKilled} leader is eliminated! ${winnerTeam} wins!`);
              newGameState.board[newY][newX].revealed = true;
              setGameState(newGameState);
              return;
          }
      }

      const targetTeam = reward.type === 'good' ? team : (team === 'Soviets' ? 'NATO' : 'Soviets');
      newGameState.scores[targetTeam].weapons += reward.weapons;
      newGameState.scores[targetTeam].cash += reward.cash;
      moveMessage += `Found resources for ${targetTeam}!`;
      tile.revealed = true;
    } else {
      moveMessage += "The tile was empty or already revealed.";
    }

    const nextTeam = team === 'Soviets' ? 'NATO' : 'Soviets';
    newGameState.currentTeam = nextTeam;
    newGameState.currentInstruction = null;
    if (nextTeam === 'Soviets') newGameState.round++;
    
    setTurn('Leader');
    
    if (newGameState.round > MAX_ROUNDS) {
        const sovietScore = newGameState.scores.Soviets.cash + newGameState.scores.Soviets.weapons * 10;
        const natoScore = newGameState.scores.NATO.cash + newGameState.scores.NATO.weapons * 10;
        const winnerTeam = sovietScore > natoScore ? 'Soviets' : 'NATO';
        setWinner(winnerTeam);
        setMessage(`Game Over! ${winnerTeam} wins by score!`);
    } else {
        setMessage(`Round ${newGameState.round}: ${nextTeam} Leader, give your instruction.`);
    }

    setGameState(newGameState);
  };
  
  const handleInstructionSubmit = (e) => {
      e.preventDefault();
      const instruction = instructionInput.trim();
      if (!instruction || instruction.split(' ').length > 1) {
          setMessage("Instruction must be a single word.");
          return;
      }
      let newGameState = JSON.parse(JSON.stringify(gameState));
      newGameState.currentInstruction = instruction;
      setGameState(newGameState);
      setTurn('Follower');
      setMessage(`${playerRole.team} Follower, move based on the instruction: "${instruction}"`);
      setInstructionInput("");
  };

  const handleFollowerMove = (x, y) => {
    if (winner || turn !== 'Follower' || gameState.board[y][x].piece) return;
    
    const follower = gameState.pieces[playerRole.team].Follower;
    const dx = Math.abs(x - follower.x);
    const dy = Math.abs(y - follower.y);

    if (dx + dy === 1) {
        processFollowerMove(follower, x, y);
    } else {
        setMessage("Invalid move. Followers can only move to adjacent, empty tiles.");
    }
  };

  useEffect(() => {
    if (!gameState || winner || isLoading) return;
    const isPlayerTurn = playerRole && gameState.currentTeam === playerRole.team && turn === playerRole.role;
    if (isPlayerTurn) return;
    const timeout = setTimeout(() => runAiTurn(), 1500);
    return () => clearTimeout(timeout);
  }, [gameState, winner, isLoading]);

  const runAiTurn = () => {
    const currentTeam = gameState.currentTeam;
    if (turn === 'Leader') {
        let newGameState = JSON.parse(JSON.stringify(gameState));
        const goodTiles = newGameState.board.flat().filter(tile => !tile.revealed && tile.reward && tile.reward.type === 'good');
        const instruction = goodTiles.length > 0 ? goodTiles[Math.floor(Math.random() * goodTiles.length)].word : "pass";
        newGameState.currentInstruction = instruction;
        setGameState(newGameState);
        setTurn('Follower');
        setMessage(`Round ${newGameState.round}: ${currentTeam} Leader instructs: "${instruction}".`);
    } else if (turn === 'Follower') {
        const instruction = gameState.currentInstruction;
        const follower = gameState.pieces[currentTeam].Follower;
        const targetTile = gameState.board.flat().find(tile => tile.word === instruction);

        let possibleMoves = [];
        [[follower.x, follower.y-1], [follower.x, follower.y+1], [follower.x-1, follower.y], [follower.x+1, follower.y]]
        .forEach(([nx, ny]) => {
          if (nx >= 0 && nx < 4 && ny >= 0 && ny < 4 && !gameState.board[ny][nx].piece) {
            const wordOnTile = gameState.board[ny][nx].word;
            if (!KILL_WORDS[wordOnTile]) possibleMoves.push({ x: nx, y: ny });
          }
        });
        
        if (possibleMoves.length === 0) {
            processFollowerMove(follower, follower.x, follower.y);
            return;
        }

        let bestMove;
        if (targetTile && !KILL_WORDS[instruction]) {
            possibleMoves.sort((a,b) => (Math.abs(a.x-targetTile.x) + Math.abs(a.y-targetTile.y)) - (Math.abs(b.x-targetTile.x) + Math.abs(b.y-targetTile.y)));
            bestMove = possibleMoves[0];
        } else {
            bestMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        }
        
        processFollowerMove(follower, bestMove.x, bestMove.y);
    }
  };

  // --- RENDER LOGIC ---
  const Tile = ({ cell, onClick }) => {
    const isPlayerFollower = playerRole.role === 'Follower';
    const isMyTeamTurn = playerRole.team === gameState.currentTeam;
    const isKillTile = cell.reward?.type === 'kill';

    let backgroundStyle = 'bg-gray-800';
    let backgroundIcon = null;

    if (cell.revealed) {
        if (isKillTile) {
            backgroundStyle = 'bg-purple-900';
            backgroundIcon = <KillTileIcon word={cell.word} />;
        } else if (cell.reward?.type === 'good') {
            backgroundStyle = 'bg-green-900';
            backgroundIcon = gameState.currentTeam === 'Soviets' ? <SovietCacheIcon /> : <NatoCacheIcon />;
        } else if (cell.reward?.type === 'bad') {
            backgroundStyle = 'bg-red-900';
            backgroundIcon = gameState.currentTeam === 'Soviets' ? <NatoCacheIcon /> : <SovietCacheIcon />;
        } else {
            backgroundStyle = 'bg-gray-700';
            backgroundIcon = <EmptyCacheIcon />;
        }
    }

    return (
        <div
            onClick={onClick}
            className={`w-24 h-24 rounded-md flex flex-col items-center justify-center transition-all duration-500 p-1 relative overflow-hidden
                ${backgroundStyle}
                ${isPlayerFollower && isMyTeamTurn && turn === 'Follower' && !cell.piece ? 'cursor-pointer hover:ring-2 ring-yellow-400' : 'cursor-default'}`
            }
        >
            {/* Background Graphic */}
            <div className="absolute inset-0 flex items-center justify-center z-0">
                {backgroundIcon}
            </div>

            {/* Game Piece */}
            <div className="relative z-10 flex-grow flex items-center justify-center">
                {cell.piece && (
                    <div className="animate-fade-in">
                        {cell.piece.role === 'Leader' ? <LeaderIcon team={cell.piece.team} /> : <FollowerIcon team={cell.piece.team} />}
                    </div>
                )}
            </div>

            {/* Word */}
            <span className={`relative z-10 text-xs w-full text-center truncate px-1 py-0.5 rounded
                ${cell.revealed ? 'text-gray-400 bg-black bg-opacity-20' : 'text-gray-300'}
                ${isKillTile && playerRole.role === 'Leader' && !cell.revealed ? 'text-purple-400 font-bold' : ''}`}>
                {cell.word}
            </span>
        </div>
    );
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><h1 className="text-3xl font-bold animate-pulse">Loading Game Data...</h1></div>;
  }

  if (!playerRole) {
    return (
      <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-5xl font-bold mb-8">Select Your Role</h1>
        <div className="grid grid-cols-2 gap-4">
          {TEAMS.map((team) => ROLES.map((role) => (
              <button key={`${team}-${role}`} onClick={() => initializeGame({ team, role })}
                className={`p-6 rounded-lg text-2xl font-semibold transition-transform transform hover:scale-105 ${team === 'Soviets' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {team} {role}
              </button>
          )))}
        </div>
      </div>
    );
  }

  const isMyTurn = playerRole.team === gameState.currentTeam && playerRole.role === turn;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans">
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg mb-4">
                <div className="text-red-500">
                    <h2 className="text-2xl font-bold">Soviets</h2>
                    <p>Weapons: {gameState.scores.Soviets.weapons}</p><p>Cash: ${gameState.scores.Soviets.cash}</p>
                </div>
                <div className="text-center">
                    <h1 className="text-3xl font-bold">{winner ? "Game Over" : `Round ${gameState.round}/${MAX_ROUNDS}`}</h1>
                    <p className="text-xl text-yellow-400 truncate max-w-sm h-7">{message}</p>
                    {winner && <button onClick={() => setPlayerRole(null)} className="mt-2 px-4 py-2 bg-green-500 rounded hover:bg-green-600">Play Again</button>}
                </div>
                <div className="text-blue-500 text-right">
                    <h2 className="text-2xl font-bold">NATO</h2>
                    <p>Weapons: {gameState.scores.NATO.weapons}</p><p>Cash: ${gameState.scores.NATO.cash}</p>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-1 bg-gray-700 p-2 rounded-lg mb-4">
                {gameState.board.map((row, y) => row.map((cell, x) => (
                    <Tile key={`${x}-${y}`} cell={cell} onClick={() => {
                        const isPlayerFollower = playerRole.role === 'Follower';
                        const isMyTeamTurn = playerRole.team === gameState.currentTeam;
                        if (isPlayerFollower && isMyTeamTurn && turn === 'Follower') {
                            handleFollowerMove(x, y);
                        }
                    }} />
                )))}
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg text-center">
                 <div className="text-lg mb-2">
                    You are: <span className={`font-bold ${playerRole.team === 'Soviets' ? 'text-red-500' : 'text-blue-500'}`}>{playerRole.team} {playerRole.role}</span>
                </div>
                {isMyTurn && playerRole.role === 'Leader' && (
                    <form onSubmit={handleInstructionSubmit} className="flex gap-2 justify-center">
                        <input type="text" value={instructionInput} onChange={(e) => setInstructionInput(e.target.value)}
                            className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            placeholder="Enter one-word instruction" />
                        <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded">
                            Give Instruction
                        </button>
                    </form>
                )}
            </div>
        </div>
    </div>
  );
}
