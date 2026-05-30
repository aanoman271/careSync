"use client";
import { Bell, HelpCircle, Search } from "lucide-react";
import React, { useState } from "react";
import { UserAvatar } from "../../../shared/UserAvatar";
import { useSession } from "next-auth/react";

const Header = () => {
  const [search, setSearch] = useState("");
  const { data: session } = useSession();

  const user = session?.user;
  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-border/10 bg-background/80 px-4 backdrop-blur-md md:px-8">
      {/* Search */}
      <div className="relative w-full max-w-xl">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patients, results, or appointments..."
          className="w-full rounded-full border border-border/30 bg-card py-2.5 pl-11 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Actions */}
      <div className="ml-4 flex shrink-0 items-center gap-3 md:ml-8 md:gap-4">
        <button className="relative rounded-full p-2 text-muted-foreground transition-all hover:bg-primary/5 hover:text-primary">
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-background bg-destructive" />
        </button>
        <button className="hidden rounded-full p-2 text-muted-foreground transition-all hover:bg-primary/5 hover:text-primary sm:block">
          <HelpCircle size={20} />
        </button>

        <div className="mx-1 hidden h-10 w-px bg-border/30 sm:block" />

        {/* User */}
        <button className="flex items-center gap-3 rounded-full border border-transparent px-2 py-1 transition-all hover:border-border/30 hover:bg-primary/5">
          <UserAvatar src={user?.image} alt={user?.name ?? "User"} />
          <div className="hidden text-left sm:block">
            <p className="text-xs font-semibold text-foreground">
              {user?.name ?? "Doctor"}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground ">
              {user?.role ?? "doctor"}
            </p>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
