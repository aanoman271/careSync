import React from "react";
import { RegisterHeader } from "../../component/Register/RegisterHeader";
import { RegisterHero } from "../../component/Register/RegisterHero";
import { RegisterToggle } from "../../component/Register/RegisterToggle";

const RegisterLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <RegisterHeader />
      <main className="mx-auto flex max-w-3xl flex-col items-center px-4 py-12 md:px-8">
        <RegisterHero />
        <RegisterToggle />
        {children}
      </main>
    </div>
  );
};

export default RegisterLayout;
