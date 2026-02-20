import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { config } from './config/wagmi';
import { ThemeProvider, useTheme } from './utils/theme';
import { Layout } from './components/layout/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Layout>
  );
}

function RainbowKitWrapper({ children }) {
  const { theme } = useTheme();
  return (
    <RainbowKitProvider theme={theme === 'dark' ? darkTheme() : lightTheme()} modalSize="compact">
      {children}
    </RainbowKitProvider>
  );
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <RainbowKitWrapper>
            <Router>
              <AppRoutes />
            </Router>
          </RainbowKitWrapper>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
