"use client"

import type { ReactNode } from "react"
import { useDrop } from "react-dnd"
import { cn } from "@/lib/utils"

interface ChessSquareProps {
  square: string
  color: string
  children?: ReactNode
  onClick: () => void
}

export function ChessSquare({ square, color, children, onClick }: ChessSquareProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "piece",
    drop: () => {
      onClick()
      return { square }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  return (
    <div
      ref={drop}
      className={cn("flex items-center justify-center relative", color, isOver && "ring-2 ring-inset ring-blue-500")}
      onClick={onClick}
    >
      {children}
      {square.charAt(1) === "1" && (
        <span className="absolute bottom-0.5 right-1 text-xs font-medium opacity-70">{square.charAt(0)}</span>
      )}
      {square.charAt(0) === "a" && (
        <span className="absolute top-0.5 left-1 text-xs font-medium opacity-70">{square.charAt(1)}</span>
      )}
    </div>
  )
}
