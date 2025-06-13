import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

export function formatDate(dateString: string): string {
  // A função aceita formatos como "dd/mm/yyyy" ou "dd/mm/yyyy às hh:mm"
  // e retorna uma versão formatada conforme necessário
  try {
    if (!dateString) return ""

    // Se o formato já estiver como esperado, apenas retorna
    if (dateString.includes("/")) {
      return dateString
    }

    // Se for uma data em formato ISO ou outro formato
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString

    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`
  } catch (error) {
    console.error("Erro ao formatar data:", error)
    return dateString
  }
}
