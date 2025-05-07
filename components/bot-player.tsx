"use client"

import { Chess, type Move } from "chess.js"

export interface BotPlayerProps {
  difficulty: string
  playingStyle: string
  customElo?: number
  adaptiveLevel?: boolean
}

// Оценка материала фигур
const PIECE_VALUES = {
  p: 100, // пешка
  n: 320, // конь
  b: 330, // слон
  r: 500, // ладья
  q: 900, // ферзь
  k: 20000, // король
}

// Позиционные бонусы для разных фигур (упрощенные)
const POSITION_BONUSES = {
  p: [
    // Бонусы для пешек
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  n: [
    // Бонусы для коней
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50],
  ],
  b: [
    // Бонусы для слонов
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20],
  ],
  r: [
    // Бонусы для ладей
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [0, 0, 0, 5, 5, 0, 0, 0],
  ],
  q: [
    // Бонусы для ферзя
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10],
    [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5],
    [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -20],
  ],
  k: [
    // Бонусы для короля (в миттельшпиле)
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [20, 20, 0, 0, 0, 0, 20, 20],
    [20, 30, 10, 0, 0, 10, 30, 20],
  ],
}

export class BotPlayer {
  private game: Chess
  private difficulty: string
  private playingStyle: string
  private customElo: number
  private adaptiveLevel: boolean
  private color: "w" | "b"
  private searchDepth: number
  private randomFactor: number

  constructor(game: Chess, props: BotPlayerProps, color: "w" | "b") {
    this.game = game
    this.difficulty = props.difficulty
    this.playingStyle = props.playingStyle
    this.customElo = props.customElo || 1500
    this.adaptiveLevel = props.adaptiveLevel || false
    this.color = color

    // Настройка параметров в зависимости от сложности
    switch (this.difficulty) {
      case "beginner":
        this.searchDepth = 1
        this.randomFactor = 0.7
        break
      case "easy":
        this.searchDepth = 1
        this.randomFactor = 0.5
        break
      case "medium":
        this.searchDepth = 2
        this.randomFactor = 0.3
        break
      case "hard":
        this.searchDepth = 2
        this.randomFactor = 0.1
        break
      case "expert":
        this.searchDepth = 3
        this.randomFactor = 0.05
        break
      case "master":
        this.searchDepth = 3
        this.randomFactor = 0
        break
      case "custom":
        // Настройка на основе ELO
        if (this.customElo < 1000) {
          this.searchDepth = 1
          this.randomFactor = 0.6
        } else if (this.customElo < 1400) {
          this.searchDepth = 1
          this.randomFactor = 0.4
        } else if (this.customElo < 1800) {
          this.searchDepth = 2
          this.randomFactor = 0.2
        } else if (this.customElo < 2200) {
          this.searchDepth = 2
          this.randomFactor = 0.1
        } else {
          this.searchDepth = 3
          this.randomFactor = 0.05
        }
        break
      default:
        this.searchDepth = 2
        this.randomFactor = 0.3
    }

    // Корректировка на основе стиля игры
    if (this.playingStyle === "aggressive") {
      this.randomFactor += 0.1 // Более случайные ходы для агрессивного стиля
    } else if (this.playingStyle === "defensive") {
      this.randomFactor -= 0.05 // Более консервативные ходы для защитного стиля
    }
  }

  // Сделать ход ботом
  makeMove(): Move | null {
    if (this.game.isGameOver() || this.game.turn() !== this.color) {
      return null
    }

    const legalMoves = this.game.moves({ verbose: true })
    if (legalMoves.length === 0) return null

    // Для начинающего уровня иногда делаем случайный ход
    if (this.difficulty === "beginner" && Math.random() < 0.4) {
      const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)]
      this.game.move(randomMove)
      return randomMove
    }

    // Для легкого уровня часто делаем случайный ход
    if (this.difficulty === "easy" && Math.random() < 0.3) {
      const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)]
      this.game.move(randomMove)
      return randomMove
    }

    // Проверяем, есть ли шах или взятие фигуры
    const captureMoves = legalMoves.filter((move) => move.captured)
    const checkMoves = legalMoves.filter((move) => {
      const testGame = new Chess(this.game.fen())
      testGame.move(move)
      return testGame.isCheck()
    })

    // Для агрессивного стиля предпочитаем взятия и шахи
    if (this.playingStyle === "aggressive" && Math.random() < 0.7) {
      if (checkMoves.length > 0) {
        const move = checkMoves[Math.floor(Math.random() * checkMoves.length)]
        this.game.move(move)
        return move
      } else if (captureMoves.length > 0) {
        const move = captureMoves[Math.floor(Math.random() * captureMoves.length)]
        this.game.move(move)
        return move
      }
    }

    // Для защитного стиля избегаем рискованных ходов
    if (this.playingStyle === "defensive" && Math.random() < 0.6) {
      // Находим ходы, которые не подвергают фигуру атаке
      const safeMoves = legalMoves.filter((move) => {
        const testGame = new Chess(this.game.fen())
        testGame.move(move)
        const opponentMoves = testGame.moves({ verbose: true })
        return !opponentMoves.some((oppMove) => oppMove.to === move.to)
      })

      if (safeMoves.length > 0) {
        const move = safeMoves[Math.floor(Math.random() * safeMoves.length)]
        this.game.move(move)
        return move
      }
    }

    // Для средних и выше уровней используем минимакс с альфа-бета отсечением
    if (["medium", "hard", "expert", "master", "custom"].includes(this.difficulty)) {
      const bestMove = this.findBestMove()
      if (bestMove) {
        this.game.move(bestMove)
        return bestMove
      }
    }

    // Если ничего не сработало, делаем случайный ход
    const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)]
    this.game.move(randomMove)
    return randomMove
  }

  // Найти лучший ход с использованием минимакс алгоритма
  private findBestMove(): Move | null {
    const legalMoves = this.game.moves({ verbose: true })
    if (legalMoves.length === 0) return null

    let bestMove: Move | null = null
    let bestScore = Number.NEGATIVE_INFINITY
    let alpha = Number.NEGATIVE_INFINITY
    const beta = Number.POSITIVE_INFINITY

    for (const move of legalMoves) {
      // Делаем ход
      this.game.move(move)

      // Оцениваем позицию
      const score = -this.minimax(this.searchDepth - 1, -beta, -alpha, false)

      // Отменяем ход
      this.game.undo()

      // Добавляем случайный фактор для разнообразия игры
      const adjustedScore = score + (Math.random() * 2 - 1) * this.randomFactor * 100

      // Обновляем лучший ход
      if (adjustedScore > bestScore) {
        bestScore = adjustedScore
        bestMove = move
      }

      // Обновляем альфа
      alpha = Math.max(alpha, bestScore)
    }

    return bestMove
  }

  // Минимакс алгоритм с альфа-бета отсечением
  private minimax(depth: number, alpha: number, beta: number, isMaximizingPlayer: boolean): number {
    // Базовый случай: достигнута максимальная глубина или игра окончена
    if (depth === 0 || this.game.isGameOver()) {
      return this.evaluatePosition()
    }

    const legalMoves = this.game.moves({ verbose: true })

    if (isMaximizingPlayer) {
      let maxScore = Number.NEGATIVE_INFINITY

      for (const move of legalMoves) {
        this.game.move(move)
        const score = this.minimax(depth - 1, alpha, beta, false)
        this.game.undo()

        maxScore = Math.max(maxScore, score)
        alpha = Math.max(alpha, score)

        if (beta <= alpha) {
          break // Альфа-бета отсечение
        }
      }

      return maxScore
    } else {
      let minScore = Number.POSITIVE_INFINITY

      for (const move of legalMoves) {
        this.game.move(move)
        const score = this.minimax(depth - 1, alpha, beta, true)
        this.game.undo()

        minScore = Math.min(minScore, score)
        beta = Math.min(beta, score)

        if (beta <= alpha) {
          break // Альфа-бета отсечение
        }
      }

      return minScore
    }
  }

  // Оценка текущей позиции
  private evaluatePosition(): number {
    // Если игра окончена, возвращаем экстремальное значение
    if (this.game.isCheckmate()) {
      return this.game.turn() === this.color ? -10000 : 10000
    }

    if (this.game.isDraw()) {
      return 0
    }

    let score = 0
    const board = this.game.board()

    // Оценка материала и позиции
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = board[row][col]
        if (square) {
          // Материальная оценка
          const pieceValue = PIECE_VALUES[square.type]
          const value = square.color === this.color ? pieceValue : -pieceValue

          // Позиционная оценка
          let positionBonus = 0
          if (POSITION_BONUSES[square.type]) {
            // Для черных фигур инвертируем доску
            const positionRow = square.color === "w" ? 7 - row : row
            positionBonus = POSITION_BONUSES[square.type][positionRow][col]
          }

          const positionValue = square.color === this.color ? positionBonus : -positionBonus

          score += value + positionValue * 0.1
        }
      }
    }

    // Дополнительные факторы в зависимости от стиля игры
    if (this.playingStyle === "aggressive") {
      // Бонус за контроль центра
      const centerControl = this.evaluateCenterControl()
      score += centerControl * 10
    } else if (this.playingStyle === "defensive") {
      // Бонус за защиту короля
      const kingSafety = this.evaluateKingSafety()
      score += kingSafety * 15
    } else if (this.playingStyle === "positional") {
      // Бонус за развитие фигур
      const development = this.evaluateDevelopment()
      score += development * 12
    }

    return score
  }

  // Оценка контроля центра (для агрессивного стиля)
  private evaluateCenterControl(): number {
    const centerSquares = ["d4", "d5", "e4", "e5"]
    let control = 0

    for (const square of centerSquares) {
      const piece = this.game.get(square)
      if (piece) {
        control += piece.color === this.color ? 1 : -1
      }
    }

    return control
  }

  // Оценка безопасности короля (для защитного стиля)
  private evaluateKingSafety(): number {
    const board = this.game.board()
    let safety = 0

    // Находим короля
    let kingRow = -1
    let kingCol = -1

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = board[row][col]
        if (square && square.type === "k" && square.color === this.color) {
          kingRow = row
          kingCol = col
          break
        }
      }
      if (kingRow !== -1) break
    }

    // Проверяем защиту вокруг короля
    if (kingRow !== -1) {
      for (let row = Math.max(0, kingRow - 1); row <= Math.min(7, kingRow + 1); row++) {
        for (let col = Math.max(0, kingCol - 1); col <= Math.min(7, kingCol + 1); col++) {
          const square = board[row][col]
          if (square && square.color === this.color && square.type !== "k") {
            safety += 1 // Свои фигуры рядом с королем
          }
        }
      }
    }

    return safety
  }

  // Оценка развития фигур (для позиционного стиля)
  private evaluateDevelopment(): number {
    const board = this.game.board()
    let development = 0

    // Проверяем, вышли ли фигуры с начальных позиций
    const backRank = this.color === "w" ? 7 : 0
    for (let col = 0; col < 8; col++) {
      const square = board[backRank][col]
      if (!square || square.color !== this.color) {
        development += 1 // Фигура покинула начальную позицию
      }
    }

    return development
  }
}
