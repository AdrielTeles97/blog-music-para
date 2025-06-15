import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import SessionProvider from "@/components/auth-provider";
import { Header } from "@/components/header";
import PopupManager from "@/components/popup-manager";
import { MusicPlayerFooter } from "@/components/music-player-footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Pará Music - Seu portal de música",
    description: "Blog musical com as melhores músicas e artistas",
    generator: "v0.dev",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <body className={inter.className}>
                <SessionProvider>
                    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                        <div className="flex flex-col min-h-screen pb-20">
                            <Header />
                            <main className="flex-1 overflow-auto">{children}</main>
                            {/* Gerenciador de popups */}
                            <PopupManager />
                            {/* Player de música global */}
                            <MusicPlayerFooter />
                        </div>
                    </ThemeProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
