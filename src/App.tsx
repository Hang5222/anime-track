import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/anime/:id" element={<DetailPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
export default App;
