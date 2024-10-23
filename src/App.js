import * as React from 'react';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import MainContainer from './components/MainContainer/MainContainer';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { DarkModeProvider } from './context/DarkModeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css';

const queryClient = new QueryClient()

const LazyMainWeather = React.lazy(() => import("./pages/MainWeather/MainWeather"))

function App() {
  return (
    <div className="App">
      <HelmetProvider>
        <Helmet>
          <title>My Weather App</title>
          <meta name="description" content="Application for searching the latest weather." />
        </Helmet>
        <DarkModeProvider>
          <QueryClientProvider client={queryClient}>
            <MainContainer>
              <React.Suspense fallback={<LoadingScreen />}>
                <LazyMainWeather />
              </React.Suspense>
            </MainContainer>
          </QueryClientProvider>
        </DarkModeProvider>
      </HelmetProvider>
    </div>
  );
}

export default App;
