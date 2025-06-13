import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import SessionProvider from "@/components/auth-provider"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import PopupManager from "@/components/popup-manager"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MusicBlog - Seu portal de música",
  description: "Blog musical com as melhores músicas e artistas",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>            <div className="flex flex-col min-h-screen">
              <Header />
              <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 overflow-auto">{children}</main>
              </div>
              {/* Gerenciador de popups */}
              <PopupManager />
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
