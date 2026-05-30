import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
      {/* Background decorative blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute h-[40%] w-[40%] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute h-[40%] w-[40%] rounded-full bg-secondary/10 blur-3xl right-0 top-0" />
      </div>
      <main className="z-10 w-full max-w-md p-4">{children}</main>
    </div>
  );
}
