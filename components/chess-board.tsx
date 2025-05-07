"use client"

import { useState, useEffect, useCallback } from "react"
import { Chess } from "chess.js"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { ChessPiece } from "@/components/chess-piece"
import { ChessSquare } from "@/components/chess-square"
import { Button } from "@/components/ui/button"
import { RotateCcw, Play, Pause, SkipForward } from "lucide-react"
import { BotPlayer, type BotPlayerProps } from "@/components/bot-player"
import { Badge } from "@/components/ui/badge"

interface ChessBoardProps {
  demoMode?: boolean
  botSettings?: BotPlayerProps
  playerColor?: "w" | "b"
  onGameEnd?: (result: string) => void
}

export function ChessBoard({ demoMode = false, botSettings, playerColor = "w", onGameEnd }: ChessBoardProps) {
  const [game] = useState(new Chess())
  const [position, setPosition] = useState<string[][]>(() => {
    // Инициализируем пустую доску
    const initialPosition: string[][] = Array(8)
      .fill(null)
      .map(() => Array(8).fill(""))

    // Заполняем начальную позицию из новой игры
    const board = game.board()
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = board[row][col]
        if (square) {
          initialPosition[row][col] = `${square.color}${square.type}`
        }
      }
    }

    return initialPosition
  })
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
  const [validMoves, setValidMoves] = useState<string[]>([])
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null)
  const [gameStatus, setGameStatus] = useState<string>("")
  const [botPlayer, setBotPlayer] = useState<BotPlayer | null>(null)
  const [isThinking, setIsThinking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const [gameState, setGameState] = useState<Chess>(game)

  // Обновление позиции при изменении игры
  useEffect(() => {
    updateBoardPosition()
    checkGameStatus()
    updateMoveHistory()
  }, [gameState])

  // Инициализация бота при изменении настроек
  useEffect(() => {
    if (botSettings) {
      const botColor = playerColor === "w" ? "b" : "w"
      const bot = new BotPlayer(game, botSettings, botColor)
      setBotPlayer(bot)

      // Если бот ходит первым (игрок играет черными)
      if (botColor === "w" && game.turn() === "w" && !game.isGameOver()) {
        makeBotMove()
      }
    }
  }, [botSettings, playerColor])

  // Демо-режим: делать случайные ходы
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (demoMode && !game.isGameOver() && !isPaused) {
      interval = setInterval(() => {
        makeRandomMove()
      }, 2000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [demoMode, gameState, isPaused])

  // Ход бота после хода игрока
  useEffect(() => {
    if (botPlayer && !demoMode && !game.isGameOver() && game.turn() !== playerColor && lastMove && !isThinking) {
      makeBotMove()
    }
  }, [lastMove, gameState, botPlayer, playerColor, demoMode])

  const resetBoard = () => {
    game.reset()
    setSelectedSquare(null)
    setValidMoves([])
    setLastMove(null)
    setGameStatus("")
    setMoveHistory([])
    setGameState(new Chess())

    // Если есть бот и он ходит первым
    if (botPlayer && playerColor === "b" && !demoMode) {
      setTimeout(() => makeBotMove(), 500)
    }
  }

  const updateBoardPosition = () => {
    const newPosition: string[][] = Array(8)
      .fill(null)
      .map(() => Array(8).fill(""))

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = game.board()[row][col]
        if (square) {
          newPosition[row][col] = `${square.color}${square.type}`
        } else {
          newPosition[row][col] = ""
        }
      }
    }

    setPosition(newPosition)
  }

  const updateMoveHistory = () => {
    const history = game.history()
    setMoveHistory(history)
  }

  const checkGameStatus = () => {
    let status = ""
    let result = ""

    if (game.isCheckmate()) {
      status = `Шах и мат! ${game.turn() === "w" ? "Черные" : "Белые"} выиграли!`
      result = game.turn() === "w" ? "black" : "white"
    } else if (game.isDraw()) {
      status = "Ничья!"
      result = "draw"
    } else if (game.isStalemate()) {
      status = "Пат!"
      result = "draw"
    } else if (game.isThreefoldRepetition()) {
      status = "Ничья по повторению позиции!"
      result = "draw"
    } else if (game.isInsufficientMaterial()) {
      status = "Ничья из-за недостаточного материала!"
      result = "draw"
    } else if (game.isCheck()) {
      status = `${game.turn() === "w" ? "Белые" : "Черные"} под шахом!`
    } else {
      status = `Ход ${game.turn() === "w" ? "белых" : "черных"}`
    }

    setGameStatus(status)

    if (result && onGameEnd) {
      onGameEnd(result)
    }
  }

  const makeRandomMove = () => {
    if (game.isGameOver() || isPaused) return

    const moves = game.moves({ verbose: true })
    if (moves.length > 0) {
      const randomMove = moves[Math.floor(Math.random() * moves.length)]
      makeMove(randomMove.from, randomMove.to)
    }
  }

  const makeBotMove = useCallback(async () => {
    if (!botPlayer || game.isGameOver() || isPaused) return

    setIsThinking(true)

    // Добавляем небольшую задержку, чтобы имитировать "размышление" бота
    const thinkingTime = Math.random() * 1000 + 500 // от 500 до 1500 мс
    await new Promise((resolve) => setTimeout(resolve, thinkingTime))

    const move = botPlayer.makeMove()
    if (move) {
      setLastMove({ from: move.from, to: move.to })
      setGameState(new Chess(game.fen()))
    }

    setIsThinking(false)
  }, [botPlayer, game, isPaused])

  const handleSquareClick = (square: string) => {
    if (demoMode || isThinking || isPaused) return

    // Если игра с ботом, проверяем, чей ход
    if (botPlayer && game.turn() !== playerColor) {
      return
    }

    // Если фигура уже выбрана
    if (selectedSquare) {
      // Если кликнули на квадрат с допустимым ходом
      if (validMoves.includes(square)) {
        makeMove(selectedSquare, square)
        setSelectedSquare(null)
        setValidMoves([])
      } else {
        // Выбираем новую фигуру
        selectPiece(square)
      }
    } else {
      // Выбираем фигуру
      selectPiece(square)
    }
  }

  const selectPiece = (square: string) => {
    const piece = game.get(square)

    // Выбираем только фигуры текущего хода
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square)

      // Получаем допустимые ходы для этой фигуры
      const moves = game.moves({ square, verbose: true })
      setValidMoves(moves.map((move) => move.to))
    } else {
      setSelectedSquare(null)
      setValidMoves([])
    }
  }

  const makeMove = (from: string, to: string) => {
    try {
      game.move({ from, to, promotion: "q" }) // Автоматически превращаем в ферзя для простоты
      setLastMove({ from, to })
      setGameState(new Chess(game.fen()))
    } catch (error) {
      console.error("Недопустимый ход:", error)
    }
  }

  const getSquareColor = (row: number, col: number, square: string) => {
    const isEven = (row + col) % 2 === 0
    const isSelected = selectedSquare === square
    const isValidMove = validMoves.includes(square)
    const isLastMoveFrom = lastMove && lastMove.from === square
    const isLastMoveTo = lastMove && lastMove.to === square

    if (isSelected) return "bg-yellow-300"
    if (isValidMove) return isEven ? "bg-green-200" : "bg-green-400"
    if (isLastMoveFrom || isLastMoveTo) return isEven ? "bg-blue-200" : "bg-blue-400"
    return isEven ? "bg-amber-100" : "bg-amber-800"
  }

  const renderBoard = () => {
    const squares = []
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"]
    const ranks = [8, 7, 6, 5, 4, 3, 2, 1]

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = `${files[col]}${ranks[row]}`
        // Добавляем проверку безопасности, чтобы убедиться, что position[row][col] существует
        const piece = position[row] && position[row][col] ? position[row][col] : ""

        squares.push(
          <ChessSquare
            key={square}
            square={square}
            color={getSquareColor(row, col, square)}
            onClick={() => handleSquareClick(square)}
          >
            {piece && <ChessPiece type={piece} />}
          </ChessSquare>,
        )
      }
    }

    return squares
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-md aspect-square border border-border rounded-md overflow-hidden shadow-lg">
        {isThinking && (
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center z-10">
            <div className="bg-background p-3 rounded-md shadow-lg">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
              <p className="mt-2 text-sm font-medium">Бот думает...</p>
            </div>
          </div>
        )}
        <DndProvider backend={HTML5Backend}>
          <div className="grid grid-cols-8 grid-rows-8 h-full w-full">{renderBoard()}</div>
        </DndProvider>
      </div>
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="flex items-center gap-2">
          <Badge variant={game.turn() === "w" ? "default" : "outline"} className="px-3 py-1">
            Белые
          </Badge>
          <Badge variant={game.turn() === "b" ? "default" : "outline"} className="px-3 py-1">
            Черные
          </Badge>
        </div>
        <p className="text-sm font-medium">{gameStatus}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={resetBoard} className="gap-1">
            <RotateCcw className="h-4 w-4" />
            Сбросить
          </Button>
          {demoMode && (
            <Button size="sm" onClick={togglePause} className="gap-1">
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              {isPaused ? "Продолжить" : "Пауза"}
            </Button>
          )}
          {!demoMode && botSettings && (
            <Button
              size="sm"
              onClick={makeBotMove}
              className="gap-1"
              disabled={isThinking || game.isGameOver() || game.turn() === playerColor}
            >
              <SkipForward className="h-4 w-4" />
              Ход бота
            </Button>
          )}
        </div>
      </div>
      {moveHistory.length > 0 && (
        <div className="w-full max-w-md mt-2">
          <div className="text-sm font-medium mb-1">История ходов:</div>
          <div className="text-xs bg-muted p-2 rounded-md max-h-24 overflow-y-auto">
            {moveHistory.map((move, index) => (
              <span key={index} className="inline-block mr-2 mb-1">
                {index % 2 === 0 ? `${Math.floor(index / 2) + 1}.` : ""} {move}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
