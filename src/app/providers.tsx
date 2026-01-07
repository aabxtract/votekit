'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
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
          theme={darkTheme({
            accentColor: 'hsl(200 100% 50%)',
            accentColorForeground: 'hsl(210 40% 98%)',
            borderRadius: 'medium',
            overlayBlur: 'small',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
