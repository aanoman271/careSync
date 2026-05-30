"use client";
import Image from "next/image";
import { ChevronDown, User } from "lucide-react";
import { useState } from "react";

interface UserAvatarProps {
  src?: string | null;
  alt?: string;
  onClick?: () => void;
}

export function UserAvatar({ src, alt = "Profile", onClick }: UserAvatarProps) {
  const [prevSrc, setPrevSrc] = useState<string | null | undefined>(src);
  const [imageError, setImageError] = useState(false);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setImageError(false);
  }

  const isValidSrc =
    src &&
    src.trim() !== "" &&
    !src.includes("profile/picture/0") &&
    !imageError;

  return (
    <div
      onClick={onClick}
      className="group flex cursor-pointer items-center gap-3 border-l border-border/30 pl-4"
    >
      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-primary/20 bg-muted transition-all group-hover:border-primary">
        {isValidSrc ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="40px"
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <User className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      {/* <ChevronDown
        size={20}
        className="text-muted-foreground transition-colors group-hover:text-primary"
      /> */}
    </div>
  );
}
