"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bot, Brain, Zap, BookOpen } from "lucide-react"

interface BotSettingsProps {
  onStartGame: (settings: BotSettings) => void
}

export interface BotSettings {
  difficulty: string
  playingStyle: string
  timeControl: string
  customElo: number
  useOpeningBook: boolean
  openingPreference: string
  adaptiveLevel: boolean
}

export function BotSettings({ onStartGame }: BotSettingsProps) {
  const [settings, setSettings] = useState<BotSettings>({
    difficulty: "medium",
    playingStyle: "balanced",
    timeControl: "5+3",
    customElo: 1500,
    useOpeningBook: true,
    openingPreference: "random",
    adaptiveLevel: false,
  })

  const handleChange = (key: keyof BotSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const difficultyDescriptions = {
    beginner: "Подходит для новичков. Делает очевидные ошибки и упускает тактические возможности.",
    easy: "Играет базовые ходы, иногда упускает простые тактики.",
    medium: "Сбалансированный уровень для игроков среднего уровня.",
    hard: "Сильный противник, редко делает ошибки.",
    expert: "Играет на уровне опытных шахматистов, использует продвинутые стратегии.",
    master: "Очень сильный уровень, сравнимый с мастерами ФИДЕ.",
    custom: "Настройте точный рейтинг ЭЛО для бота.",
  }

  const playingStyleDescriptions = {
    balanced: "Сбалансированный стиль игры.",
    aggressive: "Предпочитает атаку и жертвы для инициативы.",
    defensive: "Предпочитает прочную защиту и контратаки.",
    positional: "Фокусируется на позиционном преимуществе и долгосрочном планировании.",
    tactical: "Ищет тактические комбинации и острую игру.",
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="preset" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="preset">
            <Zap className="h-4 w-4 mr-2" />
            Предустановки
          </TabsTrigger>
          <TabsTrigger value="advanced">
            <Brain className="h-4 w-4 mr-2" />
            Расширенные
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preset" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div>
              <Label className="text-base">Уровень сложности</Label>
              <RadioGroup
                value={settings.difficulty}
                onValueChange={(value) => handleChange("difficulty", value)}
                className="grid grid-cols-2 gap-2 mt-2"
              >
                <Label
                  htmlFor="beginner"
                  className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                    settings.difficulty === "beginner" ? "border-primary" : ""
                  }`}
                >
                  <RadioGroupItem value="beginner" id="beginner" className="sr-only" />
                  <Bot className="mb-2 h-6 w-6" />
                  <span className="text-sm font-medium">Начинающий</span>
                </Label>
                <Label
                  htmlFor="easy"
                  className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                    settings.difficulty === "easy" ? "border-primary" : ""
                  }`}
                >
                  <RadioGroupItem value="easy" id="easy" className="sr-only" />
                  <Bot className="mb-2 h-6 w-6" />
                  <span className="text-sm font-medium">Легкий</span>
                </Label>
                <Label
                  htmlFor="medium"
                  className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                    settings.difficulty === "medium" ? "border-primary" : ""
                  }`}
                >
                  <RadioGroupItem value="medium" id="medium" className="sr-only" />
                  <Bot className="mb-2 h-6 w-6" />
                  <span className="text-sm font-medium">Средний</span>
                </Label>
                <Label
                  htmlFor="hard"
                  className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                    settings.difficulty === "hard" ? "border-primary" : ""
                  }`}
                >
                  <RadioGroupItem value="hard" id="hard" className="sr-only" />
                  <Bot className="mb-2 h-6 w-6" />
                  <span className="text-sm font-medium">Сложный</span>
                </Label>
                <Label
                  htmlFor="expert"
                  className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                    settings.difficulty === "expert" ? "border-primary" : ""
                  }`}
                >
                  <RadioGroupItem value="expert" id="expert" className="sr-only" />
                  <Bot className="mb-2 h-6 w-6" />
                  <span className="text-sm font-medium">Эксперт</span>
                </Label>
                <Label
                  htmlFor="master"
                  className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                    settings.difficulty === "master" ? "border-primary" : ""
                  }`}
                >
                  <RadioGroupItem value="master" id="master" className="sr-only" />
                  <Bot className="mb-2 h-6 w-6" />
                  <span className="text-sm font-medium">Мастер</span>
                </Label>
              </RadioGroup>
              {settings.difficulty && (
                <p className="text-sm text-muted-foreground mt-2">
                  {difficultyDescriptions[settings.difficulty as keyof typeof difficultyDescriptions]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-base">Стиль игры</Label>
              <Select value={settings.playingStyle} onValueChange={(value) => handleChange("playingStyle", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите стиль игры" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balanced">Сбалансированный</SelectItem>
                  <SelectItem value="aggressive">Агрессивный</SelectItem>
                  <SelectItem value="defensive">Защитный</SelectItem>
                  <SelectItem value="positional">Позиционный</SelectItem>
                  <SelectItem value="tactical">Тактический</SelectItem>
                </SelectContent>
              </Select>
              {settings.playingStyle && (
                <p className="text-sm text-muted-foreground">
                  {playingStyleDescriptions[settings.playingStyle as keyof typeof playingStyleDescriptions]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-base">Контроль времени</Label>
              <Select value={settings.timeControl} onValueChange={(value) => handleChange("timeControl", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите контроль времени" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1+0">1 мин (Пуля)</SelectItem>
                  <SelectItem value="3+2">3 мин + 2 сек (Блиц)</SelectItem>
                  <SelectItem value="5+3">5 мин + 3 сек (Блиц)</SelectItem>
                  <SelectItem value="10+5">10 мин + 5 сек (Рапид)</SelectItem>
                  <SelectItem value="15+10">15 мин + 10 сек (Рапид)</SelectItem>
                  <SelectItem value="30+0">30 мин (Классика)</SelectItem>
                  <SelectItem value="unlimited">Без ограничения времени</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="custom-elo" className="text-base">
                    Пользовательский рейтинг ЭЛО
                  </Label>
                  <span className="font-medium">{settings.customElo}</span>
                </div>
                <Slider
                  id="custom-elo"
                  min={800}
                  max={2800}
                  step={50}
                  value={[settings.customElo]}
                  onValueChange={(value) => handleChange("customElo", value[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Начинающий</span>
                  <span>Средний</span>
                  <span>Мастер</span>
                </div>
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="opening-book" className="flex flex-1 cursor-pointer items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Использовать дебютную книгу</span>
                </Label>
                <Switch
                  id="opening-book"
                  checked={settings.useOpeningBook}
                  onCheckedChange={(checked) => handleChange("useOpeningBook", checked)}
                />
              </div>

              {settings.useOpeningBook && (
                <div className="space-y-2">
                  <Label htmlFor="opening-preference">Предпочтение дебютов</Label>
                  <Select
                    value={settings.openingPreference}
                    onValueChange={(value) => handleChange("openingPreference", value)}
                  >
                    <SelectTrigger id="opening-preference">
                      <SelectValue placeholder="Выберите предпочтение дебютов" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="random">Случайные дебюты</SelectItem>
                      <SelectItem value="open">Открытые дебюты (e4)</SelectItem>
                      <SelectItem value="semi-open">Полуоткрытые дебюты</SelectItem>
                      <SelectItem value="closed">Закрытые дебюты (d4)</SelectItem>
                      <SelectItem value="flank">Фланговые дебюты</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="adaptive-level" className="flex flex-1 cursor-pointer items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <div className="space-y-1">
                    <span>Адаптивный уровень</span>
                    <p className="text-sm font-normal text-muted-foreground">
                      Бот будет адаптироваться к вашему уровню игры
                    </p>
                  </div>
                </Label>
                <Switch
                  id="adaptive-level"
                  checked={settings.adaptiveLevel}
                  onCheckedChange={(checked) => handleChange("adaptiveLevel", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button className="w-full" onClick={() => onStartGame(settings)}>
        Начать игру
      </Button>
    </div>
  )
}
