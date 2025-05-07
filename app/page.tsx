import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChessBoard } from "@/components/chess-board"
import { MainMenu } from "@/components/main-menu"
import { UserPlus, Users, Trophy, BookOpen, Play, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainMenu />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Играйте в шахматы онлайн с друзьями
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Присоединяйтесь к нашему сообществу шахматистов. Играйте матчи, улучшайте свои навыки и поднимайтесь
                    в рейтинге.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="gap-1 w-full sm:w-auto">
                      <UserPlus className="h-4 w-4" />
                      Создать аккаунт
                    </Button>
                  </Link>
                  <Link href="/play">
                    <Button size="lg" variant="outline" className="gap-1 w-full sm:w-auto">
                      Играть как гость
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto w-full max-w-[500px] lg:max-w-none">
                <div className="aspect-square max-w-[450px] mx-auto">
                  <ChessBoard demoMode={true} />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Возможности</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Всё необходимое для потрясающего шахматного опыта
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Мультиплеер</h3>
                  <p className="text-muted-foreground">
                    Играйте против друзей или случайных соперников со всего мира в матчах в реальном времени.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Турниры</h3>
                  <p className="text-muted-foreground">
                    Участвуйте в ежедневных, еженедельных и ежемесячных турнирах, чтобы проверить свои навыки и выиграть
                    призы.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Обучение</h3>
                  <p className="text-muted-foreground">
                    Улучшайте свою игру с помощью уроков, головоломок и инструментов анализа, разработанных для всех
                    уровней мастерства.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Начните играть сейчас</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Выберите режим игры и начните свое шахматное путешествие
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="group relative overflow-hidden rounded-lg border bg-background p-2">
                <div className="flex h-[200px] flex-col justify-between rounded-md p-6">
                  <Play className="h-12 w-12 text-primary" />
                  <div className="space-y-2">
                    <h3 className="font-bold">Играть с компьютером</h3>
                    <p className="text-sm text-muted-foreground">Тренируйтесь против ИИ разных уровней сложности</p>
                  </div>
                </div>
                <div className="p-2">
                  <Link href="/play">
                    <Button className="w-full gap-1">
                      Начать игру
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-lg border bg-background p-2">
                <div className="flex h-[200px] flex-col justify-between rounded-md p-6">
                  <Users className="h-12 w-12 text-primary" />
                  <div className="space-y-2">
                    <h3 className="font-bold">Играть с другом</h3>
                    <p className="text-sm text-muted-foreground">Создайте приватную игру и пригласите друга</p>
                  </div>
                </div>
                <div className="p-2">
                  <Link href="/play?mode=friend">
                    <Button className="w-full gap-1">
                      Создать игру
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-lg border bg-background p-2">
                <div className="flex h-[200px] flex-col justify-between rounded-md p-6">
                  <Trophy className="h-12 w-12 text-primary" />
                  <div className="space-y-2">
                    <h3 className="font-bold">Турниры</h3>
                    <p className="text-sm text-muted-foreground">Участвуйте в турнирах и соревнуйтесь за призы</p>
                  </div>
                </div>
                <div className="p-2">
                  <Link href="/tournaments">
                    <Button className="w-full gap-1">
                      Найти турнир
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-4 md:px-6">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} ChessMaster. Все права защищены.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Условия
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Конфиденциальность
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Контакты
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
