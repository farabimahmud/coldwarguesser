'use client';

import React from 'react';
import { useGameLogic } from './hooks/useGameLogic.js';
import { LoadingScreen } from './components/ui/LoadingScreen.js';
import { RoleSelection } from './components/game/RoleSelection.js';
import { GameLayout } from './components/layout/GameLayout.js';

/**
 * Main Game component - now much cleaner and focused on orchestration
 * 
 * This component follows the Facade pattern, providing a simple interface
 * to the complex game subsystem. It delegates all logic to specialized
 * services and components.
 */
export default function Game() {
    const {
        isLoading,
        playerRole,
        gameState,
        turn,
        winner,
        message,
        isMyTurn,
        initializeGame,
        handleTileClick,
        handleInstructionSubmit,
        resetGame
    } = useGameLogic();

    // Loading state
    if (isLoading) {
        return <LoadingScreen />;
    }

    // Role selection state
    if (!playerRole) {
        return <RoleSelection onRoleSelect={initializeGame} />;
    }

    // Main game state
    return (
        <GameLayout
            gameState={gameState}
            playerRole={playerRole}
            turn={turn}
            winner={winner}
            message={message}
            isMyTurn={isMyTurn}
            onTileClick={handleTileClick}
            onInstructionSubmit={handleInstructionSubmit}
            onPlayAgain={resetGame}
        />
    );
}
