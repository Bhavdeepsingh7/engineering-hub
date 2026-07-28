import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import AuthBridge from "./components/AuthBridge";

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!clerkPublishableKey) throw new Error('VITE_CLERK_PUBLISHABLE_KEY is required')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <AuthBridge/>
      <App />
    </ClerkProvider>
  </StrictMode>,
)
