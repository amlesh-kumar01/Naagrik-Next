import { Navbar } from './navbar'
import { Footer } from './footer'

interface LayoutProps {
  children: React.ReactNode
  showFooter?: boolean
}

export function Layout({ children, showFooter = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <main className="relative z-10">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  )
}
