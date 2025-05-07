import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/app/navbar/navbar";

export const metadata = {
  title: "Profile Builder",
  description: "A customizable profile page builder",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto p-4">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
