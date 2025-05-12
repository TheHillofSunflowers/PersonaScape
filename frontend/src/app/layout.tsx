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
      <body className="min-h-screen bg-brand-50 dark:bg-brand-900 text-brand-900 dark:text-brand-50 transition-colors">
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto px-4 py-10 max-w-5xl">
            <div className="card p-8 md:p-10 mt-8 mb-16 animate-fade-in">
              {children}
            </div>
          </main>
          <footer className="py-6 bg-transparent border-t border-brand-200 dark:border-brand-800 text-center text-brand-500 dark:text-brand-400 text-sm">
            <p>© {new Date().getFullYear()} PersonaScape. All rights reserved.</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
