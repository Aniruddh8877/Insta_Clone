import "./globals.css";
import Navbar from "@/components/Navbar";
import { ReduxProvider } from "@/redux/provider";

export const metadata = {
  title: "Instagram Clone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">
        <ReduxProvider>
          <Navbar />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
