import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'
import Index from './pages/Index'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import QuotesList from './pages/quotes/QuotesList'
import NewQuote from './pages/quotes/NewQuote'
import ViabilityAnalysis from './pages/analysis/ViabilityAnalysis'
import ClientManagement from './pages/clients/ClientManagement'
import ProfitabilityReport from './pages/reports/ProfitabilityReport'
import CalculationSettings from './pages/settings/CalculationSettings'
import TaxModule from './pages/tax/TaxModule'
import AuditLog from './pages/audit/AuditLog'
import UserManagement from './pages/users/UserManagement'
import ReferenceTables from './pages/territorial/ReferenceTables'
import ReverseCubage from './pages/tools/ReverseCubage'

const App = () => (
  <BrowserRouter
    future={{ v7_startTransition: false, v7_relativeSplatPath: false }}
  >
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/quotes" element={<QuotesList />} />
          <Route path="/quotes/new" element={<NewQuote />} />
          <Route path="/analysis" element={<ViabilityAnalysis />} />
          <Route path="/clients" element={<ClientManagement />} />
          <Route path="/reports" element={<ProfitabilityReport />} />
          <Route path="/settings" element={<CalculationSettings />} />
          <Route path="/tax" element={<TaxModule />} />
          <Route path="/audit" element={<AuditLog />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/territorial" element={<ReferenceTables />} />
          <Route path="/tools/reverse-cubage" element={<ReverseCubage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
