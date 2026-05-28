import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'
import { useAuthStore } from './store/auth.store'

const queryClient = new QueryClient()

function Root() {
  const initialize = useAuthStore(state => state.initialize);
  const isInitializing = useAuthStore(state => state.isInitializing);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isInitializing) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background text-foreground">
         <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Initializing Cluster...</span>
         </div>
      </div>
    );
  }

  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Root />
    </QueryClientProvider>
  </React.StrictMode>,
)
 Broadway