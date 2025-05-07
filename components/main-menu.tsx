"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Menu, ChevronRight, LogIn, UserPlus, Trophy, BookOpen, Play, Home, Users } from "lucide-react"

const menuItems = [
  { name: "Главная", href: "/", icon: Home },
  { name: "Играть", href: "/play", icon: Play },
  { name: "Учиться", href: "/learn", icon: BookOpen },
  { name: "Турниры", href: "/tournaments", icon: Trophy },
  { name: "Сообщество", href: "/community", icon: Users },
]

export function MainMenu() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
          : "bg-background",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                <div className="bg-amber-100"></div>
                <div className="bg-amber-800"></div>
                <div className="bg-amber-800"></div>
                <div className="bg-amber-100"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">♞</div>
            </div>
            <span className="text-xl font-bold hidden sm:inline-block">ChessMaster</span>
            <span className="text-xl font-bold sm:hidden">CM</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "gap-1 transition-all",
                    isActive ? "font-medium" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <Link href="/login">
              <Button variant="outline" size="sm" className="gap-1">
                <LogIn className="h-4 w-4" />
                Войти
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="gap-1">
                <UserPlus className="h-4 w-4" />
                Регистрация
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Открыть меню</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:w-[350px] pr-0">
              <SheetHeader className="pb-6 border-b">
                <SheetTitle className="flex items-center gap-2">
                  <div className="relative h-8 w-8">
                    <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                      <div className="bg-amber-100"></div>
                      <div className="bg-amber-800"></div>
                      <div className="bg-amber-800"></div>
                      <div className="bg-amber-100"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">♞</div>
                  </div>
                  <span className="text-xl font-bold">ChessMaster</span>
                </SheetTitle>
              </SheetHeader>
              <div className="py-6 pr-6">
                <nav className="flex flex-col gap-2">
                  {menuItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon
                    return (
                      <SheetClose asChild key={item.href}>
                        <Link href={item.href}>
                          <Button
                            variant={isActive ? "secondary" : "ghost"}
                            className={cn(
                              "w-full justify-between",
                              isActive ? "font-medium" : "text-muted-foreground hover:text-foreground",
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <Icon className="h-5 w-5" />
                              {item.name}
                            </div>
                            <ChevronRight className="h-4 w-4 opacity-50" />
                          </Button>
                        </Link>
                      </SheetClose>
                    )
                  })}
                </nav>
              </div>
              <div className="absolute bottom-0 left-0 right-6 p-6 border-t bg-background">
                <div className="grid grid-cols-2 gap-2">
                  <SheetClose asChild>
                    <Link href="/login" className="w-full">
                      <Button variant="outline" className="w-full gap-1">
                        <LogIn className="h-4 w-4" />
                        Войти
                      </Button>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/register" className="w-full">
                      <Button className="w-full gap-1">
                        <UserPlus className="h-4 w-4" />
                        Регистрация
                      </Button>
                    </Link>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
