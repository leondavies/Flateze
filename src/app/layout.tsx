import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";
import { ThemeProvider } from "@/contexts/theme-context";
import { NotificationsProvider } from "@/contexts/notifications-context";
import { ToastNotifications } from "@/components/notifications/toast-notifications";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Flateze - Transparent Bill Management",
  description: "Manage bills transparently in your flat without a head tenant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <NotificationsProvider>
            <SessionProvider>
              {children}
            </SessionProvider>
            <ToastNotifications />
          </NotificationsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
