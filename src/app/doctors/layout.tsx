import { DoctorsLayoutProps } from "@/types/doctor";
import React from "react";

const Doctorslayout = ({ children }: DoctorsLayoutProps) => {
  return <div className="min-h-screen bg-background">{children}</div>;
};

export default Doctorslayout;
