export function Footer() {
  return (
    <footer className="relative z-10 bg-white/90 backdrop-blur-sm border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">N</span>
            </div>
            <span className="text-gray-700 font-semibold">Naagrik</span>
          </div>
          
          <div className="text-sm text-gray-600 text-center">
            <p>&copy; 2024 Naagrik. All rights reserved.</p>
            <p>Empowering communities for a better tomorrow.</p>
          </div>
          
          <div className="text-sm text-gray-600">
            <p>For queries: <a href="mailto:info@naagrik.app" className="text-indigo-600 hover:underline">info@naagrik.app</a></p>
          </div>
        </div>
      </div>
    </footer>
  )
}
