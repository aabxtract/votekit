import type { PropsWithChildren } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ConnectButton } from "@rainbow-me/rainbowkit";

type HeaderProps = {
  title: string;
};

export function Header({ title, children }: PropsWithChildren<HeaderProps>) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {children}
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
