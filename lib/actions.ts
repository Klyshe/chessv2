"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// This is a mock database for demonstration purposes
// In a real application, you would use a proper database
const users = new Map()

interface User {
  id: string
  username: string
  email: string
  password: string // In a real app, this would be hashed
  createdAt: Date
  games: Game[]
}

interface Game {
  id: string
  white: string // user id
  black: string // user id or "computer"
  moves: string[] // array of moves in algebraic notation
  result: "white" | "black" | "draw" | null
  createdAt: Date
  updatedAt: Date
}

export async function createUser({
  username,
  email,
  password,
}: {
  username: string
  email: string
  password: string
}) {
  // Check if user already exists
  if (users.has(email)) {
    throw new Error("User already exists")
  }

  // Create a new user
  const userId = Math.random().toString(36).substring(2, 15)
  const newUser: User = {
    id: userId,
    username,
    email,
    password, // In a real app, hash this password
    createdAt: new Date(),
    games: [],
  }

  // Save user to our mock database
  users.set(email, newUser)

  return { success: true }
}

export async function loginUser({
  email,
  password,
}: {
  email: string
  password: string
}) {
  // Get user from our mock database
  const user = users.get(email)

  // Check if user exists and password matches
  if (!user || user.password !== password) {
    throw new Error("Invalid credentials")
  }

  // Set a cookie to "authenticate" the user
  // In a real app, you would use a proper authentication system
  cookies().set("userId", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })

  return { success: true }
}

export async function logoutUser() {
  cookies().delete("userId")
  redirect("/")
}

export async function getCurrentUser() {
  const userId = cookies().get("userId")?.value

  if (!userId) {
    return null
  }

  // Find user by ID in our mock database
  for (const user of users.values()) {
    if (user.id === userId) {
      // Don't return the password
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    }
  }

  return null
}

export async function createGame({
  opponent = "computer",
  color = Math.random() > 0.5 ? "white" : "black",
}: {
  opponent?: string
  color?: "white" | "black"
} = {}) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const gameId = Math.random().toString(36).substring(2, 15)
  const now = new Date()

  const game: Game = {
    id: gameId,
    white: color === "white" ? user.id : opponent,
    black: color === "black" ? user.id : opponent,
    moves: [],
    result: null,
    createdAt: now,
    updatedAt: now,
  }

  // Add game to user's games
  user.games.push(game)

  return game
}

export async function saveGameMove({
  gameId,
  move,
}: {
  gameId: string
  move: string
}) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  // Find the game
  const game = user.games.find((g) => g.id === gameId)

  if (!game) {
    throw new Error("Game not found")
  }

  // Add move to game
  game.moves.push(move)
  game.updatedAt = new Date()

  return game
}

export async function endGame({
  gameId,
  result,
}: {
  gameId: string
  result: "white" | "black" | "draw"
}) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  // Find the game
  const game = user.games.find((g) => g.id === gameId)

  if (!game) {
    throw new Error("Game not found")
  }

  // Update game result
  game.result = result
  game.updatedAt = new Date()

  return game
}
