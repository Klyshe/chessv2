"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChessBoard } from "@/components/chess-board"
import { BotSettings, type BotSettings as BotSettingsType } from "@/components/bot-settings"
import { MainMenu } from "@/components/main-menu"
import { ChevronLeft, Clock, Users, Bot, Trophy, ArrowRight } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import React from "react"

// Добавить в начало файла после импортов
class ErrorBoundary extends React.Component<{ children: React.ReactNode; fallback: React.ReactNode }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: any, info: any) {
    console.error("Chess board error:", error, info)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

export default function PlayPage() {
  const searchParams = useSearchParams()
  const initialMode = searchParams.get("mode") || "computer"
  const [gameMode, setGameMode] = useState<string>(initialMode)
  const [gameStarted, setGameStarted] = useState(false)
  const [currentBotSettings, setCurrentBotSettings] = useState<BotSettingsType | null>(null)
  const [showAlert, setShowAlert] = useState(false)
  const [playerColor, setPlayerColor] = useState<"w" | "b">("w")
  const [gameResult, setGameResult] = useState<string | null>(null)

  useEffect(() => {
    if (initialMode && initialMode !== gameMode) {
      setGameMode(initialMode)
    }
  }, [initialMode])

  const handleStartGame = (settings: BotSettingsType) => {
    setCurrentBotSettings(settings)
    setGameStarted(true)
    setShowAlert(true)
    setGameResult(null)

    // Hide the alert after 5 seconds
    setTimeout(() => {
      setShowAlert(false)
    }, 5000)
  }

  const resetGame = () => {
    setGameStarted(false)
    setCurrentBotSettings(null)
    setGameResult(null)
  }

  const handleGameEnd = (result: string) => {
    setGameResult(result)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MainMenu />
      <div className="container mx-auto py-6 px-4 md:px-6 flex-1">
        <div className="flex items-center mb-6">
          <Link href="/" className="mr-4">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Играть в шахматы</h1>
        </div>

        <div className="grid lg:grid-cols-[1fr_350px] gap-6">
          <div className="flex flex-col">
            <Card className="mb-6">
              <CardContent className="p-4 sm:p-6">
                <div className="aspect-square max-w-[600px] mx-auto">
                  {/* Добавляем обработку ошибок */}
                  <ErrorBoundary fallback={<div className="p-4 text-red-500">Ошибка при загрузке шахматной доски</div>}>
                    <ChessBoard
                      botSettings={currentBotSettings || undefined}
                      playerColor={playerColor}
                      onGameEnd={handleGameEnd}
                    />
                  </ErrorBoundary>
                </div>
              </CardContent>
              {showAlert && currentBotSettings && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <Alert className="bg-green-50 border-green-200">
                    <Bot className="h-4 w-4 text-green-600" />
                    <AlertTitle>Игра началась!</AlertTitle>
                    <AlertDescription>
                      Вы играете {playerColor === "w" ? "белыми" : "черными"} против бота уровня{" "}
                      <span className="font-medium">
                        {currentBotSettings.difficulty === "beginner" && "Начинающий"}
                        {currentBotSettings.difficulty === "easy" && "Легкий"}
                        {currentBotSettings.difficulty === "medium" && "Средний"}
                        {currentBotSettings.difficulty === "hard" && "Сложный"}
                        {currentBotSettings.difficulty === "expert" && "Эксперт"}
                        {currentBotSettings.difficulty === "master" && "Мастер"}
                        {currentBotSettings.difficulty === "custom" && `ЭЛО ${currentBotSettings.customElo}`}
                      </span>{" "}
                      со стилем игры{" "}
                      <span className="font-medium">
                        {currentBotSettings.playingStyle === "balanced" && "Сбалансированный"}
                        {currentBotSettings.playingStyle === "aggressive" && "Агрессивный"}
                        {currentBotSettings.playingStyle === "defensive" && "Защитный"}
                        {currentBotSettings.playingStyle === "positional" && "Позиционный"}
                        {currentBotSettings.playingStyle === "tactical" && "Тактический"}
                      </span>
                    </AlertDescription>
                  </Alert>
                </div>
              )}
              {gameResult && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <Alert
                    className={
                      gameResult === "draw"
                        ? "bg-blue-50 border-blue-200"
                        : (gameResult === "white" && playerColor === "w") ||
                            (gameResult === "black" && playerColor === "b")
                          ? "bg-green-50 border-green-200"
                          : "bg-amber-50 border-amber-200"
                    }
                  >
                    <Trophy
                      className={`h-4 w-4 ${
                        gameResult === "draw"
                          ? "text-blue-600"
                          : (gameResult === "white" && playerColor === "w") ||
                              (gameResult === "black" && playerColor === "b")
                            ? "text-green-600"
                            : "text-amber-600"
                      }`}
                    />
                    <AlertTitle>
                      {gameResult === "draw"
                        ? "Ничья!"
                        : (gameResult === "white" && playerColor === "w") ||
                            (gameResult === "black" && playerColor === "b")
                          ? "Поздравляем! Вы выиграли!"
                          : "Вы проиграли!"}
                    </AlertTitle>
                    <AlertDescription>
                      {gameResult === "draw"
                        ? "Игра завершилась вничью."
                        : (gameResult === "white" && playerColor === "w") ||
                            (gameResult === "black" && playerColor === "b")
                          ? "Вы победили бота! Отличная игра!"
                          : "Бот выиграл эту партию. Попробуйте еще раз!"}
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </Card>
            {gameStarted && (
              <div className="flex justify-center mb-6">
                <Button variant="outline" onClick={resetGame}>
                  Настроить бота заново
                </Button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <Tabs defaultValue={gameMode} onValueChange={setGameMode} className="w-full">
              <TabsList className="grid grid-cols-3 mb-4 w-full">
                <TabsTrigger value="computer">
                  <Bot className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Компьютер</span>
                  <span className="sm:hidden">ИИ</span>
                </TabsTrigger>
                <TabsTrigger value="friend">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Друг</span>
                  <span className="sm:hidden">Друг</span>
                </TabsTrigger>
                <TabsTrigger value="tournament">
                  <Trophy className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Турнир</span>
                  <span className="sm:hidden">Турнир</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="computer" className="space-y-4">
                {!gameStarted ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Игра против компьютера</CardTitle>
                      <CardDescription>Настройте бота под свои предпочтения</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <h3 className="text-sm font-medium mb-2">Выберите цвет фигур:</h3>
                        <RadioGroup
                          defaultValue={playerColor}
                          onValueChange={(value) => setPlayerColor(value as "w" | "b")}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="w" id="white" />
                            <Label htmlFor="white">Белые</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="b" id="black" />
                            <Label htmlFor="black">Черные</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <BotSettings onStartGame={handleStartGame} />
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Текущая игра</CardTitle>
                      <CardDescription>Вы играете против бота</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-lg border p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">Ваш цвет</h3>
                            <p className="text-sm text-muted-foreground">{playerColor === "w" ? "Белые" : "Черные"}</p>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">Уровень сложности</h3>
                            <p className="text-sm text-muted-foreground">
                              {currentBotSettings?.difficulty === "beginner" && "Начинающий"}
                              {currentBotSettings?.difficulty === "easy" && "Легкий"}
                              {currentBotSettings?.difficulty === "medium" && "Средний"}
                              {currentBotSettings?.difficulty === "hard" && "Сложный"}
                              {currentBotSettings?.difficulty === "expert" && "Эксперт"}
                              {currentBotSettings?.difficulty === "master" && "Мастер"}
                              {currentBotSettings?.difficulty === "custom" && `ЭЛО ${currentBotSettings.customElo}`}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">Стиль игры</h3>
                            <p className="text-sm text-muted-foreground">
                              {currentBotSettings?.playingStyle === "balanced" && "Сбалансированный"}
                              {currentBotSettings?.playingStyle === "aggressive" && "Агрессивный"}
                              {currentBotSettings?.playingStyle === "defensive" && "Защитный"}
                              {currentBotSettings?.playingStyle === "positional" && "Позиционный"}
                              {currentBotSettings?.playingStyle === "tactical" && "Тактический"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">Контроль времени</h3>
                            <p className="text-sm text-muted-foreground">{currentBotSettings?.timeControl}</p>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                          </div>
                        </div>
                      </div>
                      {currentBotSettings?.adaptiveLevel && (
                        <div className="rounded-lg border p-3 bg-primary/10">
                          <div className="flex items-center">
                            <div>
                              <h3 className="font-medium">Адаптивный уровень</h3>
                              <p className="text-sm text-muted-foreground">
                                Бот будет адаптироваться к вашему уровню игры
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="friend" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Игра с другом</CardTitle>
                    <CardDescription>Пригласите друга сыграть с вами</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border p-4 bg-muted/50">
                      <h3 className="font-medium mb-2">Создать приватную игру</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Создайте игру и отправьте ссылку другу для начала матча
                      </p>
                      <Button className="w-full">Создать игру</Button>
                    </div>

                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-2">Присоединиться к игре</h3>
                      <p className="text-sm text-muted-foreground mb-4">Введите код игры, который вам отправил друг</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Код игры"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <Button>Войти</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tournament" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Присоединиться к турниру</CardTitle>
                    <CardDescription>Соревнуйтесь с игроками со всего мира</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">Ежедневный блиц</h3>
                          <p className="text-sm text-muted-foreground">5+2 • 7 раундов</p>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-sm">Начало через 2ч</span>
                        </div>
                      </div>
                      <Button size="sm" className="w-full mt-3">
                        Присоединиться
                      </Button>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">Выходной рапид</h3>
                          <p className="text-sm text-muted-foreground">10+5 • 5 раундов</p>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-sm">Начало через 1д</span>
                        </div>
                      </div>
                      <Button size="sm" className="w-full mt-3">
                        Присоединиться
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Посмотреть все турниры
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle>История игр</CardTitle>
                <CardDescription>Ваши недавние игры</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium">vs. Компьютер (Средний)</p>
                      <p className="text-sm text-muted-foreground">Победа • 32 хода</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium">vs. Компьютер (Сложный)</p>
                      <p className="text-sm text-muted-foreground">Поражение • 28 ходов</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div>
                      <p className="font-medium">vs. Компьютер (Легкий)</p>
                      <p className="text-sm text-muted-foreground">Победа • 19 ходов</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Посмотреть все игры
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
