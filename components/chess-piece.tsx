import { useDrag } from "react-dnd"
import { cn } from "@/lib/utils"

interface ChessPieceProps {
  type: string
}

export function ChessPiece({ type }: ChessPieceProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "piece",
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const getPieceSymbol = (type: string) => {
    const color = type.charAt(0)
    const piece = type.charAt(1)

    const symbols: Record<string, string> = {
      wp: "♙", // white pawn
      wr: "♖", // white rook
      wn: "♘", // white knight
      wb: "♗", // white bishop
      wq: "♕", // white queen
      wk: "♔", // white king
      bp: "♟", // black pawn
      br: "♜", // black rook
      bn: "♞", // black knight
      bb: "♝", // black bishop
      bq: "♛", // black queen
      bk: "♚", // black king
    }

    return symbols[`${color}${piece}`] || ""
  }

  return (
    <div
      ref={drag}
      className={cn(
        "flex items-center justify-center w-full h-full text-4xl cursor-grab",
        type.startsWith("w") ? "text-white" : "text-black",
        isDragging && "opacity-50",
      )}
    >
      {getPieceSymbol(type)}
    </div>
  )
}
