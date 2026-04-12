'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { LogIn, LogOut } from 'lucide-react';

const ICON = 'h-4 w-4';

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') return null;

  if (session?.user) {
    return (
      <div className="flex items-center gap-2 px-1">
        {session.user.image && (
          <img
            src={session.user.image}
            alt=""
            className="w-6 h-6 rounded-full"
          />
        )}
        <span className="text-xs text-foreground/70 truncate max-w-[80px]">
          {session.user.name}
        </span>
        <button
          onClick={() => signOut()}
          className="p-1.5 rounded-lg text-foreground/40 hover:bg-foreground/5 hover:text-foreground transition-colors"
          title="Sign out"
        >
          <LogOut className={ICON} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn()}
      className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-foreground/70 hover:bg-foreground/5 hover:text-foreground transition-colors border border-border/60"
    >
      <LogIn className={ICON} />
      Sign in
    </button>
  );
}
