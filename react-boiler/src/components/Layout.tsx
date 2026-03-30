import { Link, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-gray-900">
            React Boiler
          </Link>
          <div className="flex gap-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
          </div>
        </nav>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <Outlet />
      </main>

      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
          React + Vite + Tailwind Boilerplate
        </div>
      </footer>
    </div>
  )
}
