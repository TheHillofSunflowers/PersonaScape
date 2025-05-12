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
      <body className="min-h-screen bg-accent-100 dark:bg-accent-900">
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto px-4 py-6 max-w-7xl animate-fade-in">
            {children}
          </main>
          <footer className="py-6 mt-12 bg-accent-200 dark:bg-accent-800 shadow-soft border-t border-accent-300 dark:border-accent-700">
            <div className="container mx-auto px-4 text-center text-accent-700 dark:text-accent-400 text-sm">
              <p>© {new Date().getFullYear()} PersonaScape. All rights reserved.</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
