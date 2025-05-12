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
      <body className="min-h-screen bg-[#16171d] text-white">
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="py-6 bg-[#1e1f27] border-t border-[#32333c] text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} PersonaScape. All rights reserved.</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
