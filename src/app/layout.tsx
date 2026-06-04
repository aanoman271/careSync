import { Navbar } from "@/app/component/Header/Navbar";
import "../app/globals.css";
import AuthProvider from "@/app/Context/AuthProvider";
import Footer from "@/app/component/Fotter/Fotter";
import TanstackProvider from "./Context/TanstackProvider";
interface LayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html>
      <body>
        <AuthProvider>
          <TanstackProvider>
            <Navbar />
            <main className="w-full flex flex-col items-center">
              {children}
            </main>
            <Footer />
          </TanstackProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
