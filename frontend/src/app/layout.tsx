import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/app/navbar/navbar";

export const metadata = {
  title: "PersonaScape",
  description: "Create customizable, shareable profile pages with interactive social features",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-900 dark:to-accent-800">
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto px-4 py-6 max-w-7xl animate-fade-in">
            {children}
          </main>
          <footer className="py-6 mt-12 bg-white dark:bg-accent-800 shadow-soft border-t border-accent-200 dark:border-accent-700">
            <div className="container mx-auto px-4 text-center text-accent-500 dark:text-accent-400 text-sm">
              <p>© {new Date().getFullYear()} PersonaScape. All rights reserved.</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
