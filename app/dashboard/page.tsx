"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getCurrentUser, logoutUser } from "@/lib/actions"
import { ChevronRight, LogOut, Play, Trophy, BookOpen, Settings, BarChart } from "lucide-react"

interface UserData {
  id: string
  username: string
  email: string
  games: any[]
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await getCurrentUser()
        setUser(userData)
      } catch (error) {
        console.error("Failed to load user:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">You need to be logged in</h1>
        <p className="mb-6">Please log in to access your dashboard</p>
        <div className="flex justify-center gap-4">
          <Link href="/login">
            <Button>Log In</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Go Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder.svg?height=64&width=64" alt={user.username} />
            <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/settings">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
          <form action={logoutUser}>
            <Button variant="outline" size="sm" type="submit">
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          </form>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Games</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.games.length || 0}</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1250</div>
            <p className="text-xs text-muted-foreground">+25 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tournaments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">1 upcoming</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="games">Games</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Link href="/play">
                  <Button className="w-full justify-between" variant="outline">
                    <div className="flex items-center">
                      <Play className="h-4 w-4 mr-2" />
                      Play a Game
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/tournaments">
                  <Button className="w-full justify-between" variant="outline">
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 mr-2" />
                      Join Tournament
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/learn">
                  <Button className="w-full justify-between" variant="outline">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Learn New Tactics
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Games</CardTitle>
                <CardDescription>Your last 3 games</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                {user.games.length > 0 ? (
                  user.games.slice(0, 3).map((game, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">vs. Computer</p>
                        <p className="text-sm text-muted-foreground">
                          {game.result === "white" && game.white === user.id
                            ? "Victory"
                            : game.result === "black" && game.black === user.id
                              ? "Victory"
                              : game.result === "draw"
                                ? "Draw"
                                : "Defeat"}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground py-2">No games played yet</p>
                )}
              </CardContent>
              <CardFooter>
                <Link href="/games">
                  <Button variant="outline" size="sm">
                    View All Games
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
                <CardDescription>Your chess statistics</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm">Average game length</span>
                  <span className="font-medium">24 moves</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm">Favorite opening</span>
                  <span className="font-medium">Queen's Gambit</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm">Win as white</span>
                  <span className="font-medium">72%</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm">Win as black</span>
                  <span className="font-medium">64%</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/stats">
                  <Button variant="outline" size="sm" className="gap-1">
                    <BarChart className="h-4 w-4" />
                    Detailed Stats
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="games" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Game History</CardTitle>
              <CardDescription>All your chess games</CardDescription>
            </CardHeader>
            <CardContent>
              {user.games.length > 0 ? (
                <div className="space-y-2">
                  {user.games.map((game, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">Game #{index + 1}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(game.createdAt).toLocaleDateString()} •
                          {game.result === "white" && game.white === user.id
                            ? " Victory"
                            : game.result === "black" && game.black === user.id
                              ? " Victory"
                              : game.result === "draw"
                                ? " Draw"
                                : " Defeat"}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Game
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You haven't played any games yet</p>
                  <Link href="/play">
                    <Button>Play Your First Game</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>Your chess performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Detailed statistics will appear here as you play more games</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
