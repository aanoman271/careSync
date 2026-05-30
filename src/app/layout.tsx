import { Navbar } from "@/app/component/Header/Navbar";
import "../app/globals.css";
import AuthProvider from "@/app/Context/AuthProvider";
import Footer from "@/app/component/Fotter/Fotter";
interface LayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html>
      <body>
        <AuthProvider>
          <Navbar />
          <main className="w-full flex flex-col items-center">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
