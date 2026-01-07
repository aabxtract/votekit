'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';

const queryClient = new QueryClient();

// It is recommended to get a project ID from WalletConnect Cloud.
// https://cloud.walletconnect.com/
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'c1b50f09b5597f742918e5927c3274f8';

const config = getDefaultConfig({
  appName: 'VoterKit',
  projectId,
  chains: [sepolia],
  ssr: true,
});

export function Providers({ children }: PropsWithChildren) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={{
            lightMode: lightTheme({
              accentColor: 'hsl(262 34% 48%)',
              accentColorForeground: 'hsl(0 0% 100%)',
              borderRadius: 'medium',
            }),
            darkMode: darkTheme({
              accentColor: 'hsl(262 34% 68%)',
              accentColorForeground: 'hsl(0 0% 100%)',
              borderRadius: 'medium',
            }),
          }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
