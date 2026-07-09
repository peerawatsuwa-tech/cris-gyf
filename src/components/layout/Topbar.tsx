import { Bell, Search } from 'lucide-react'

export function Topbar() {
  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 py-4">
      <div>
        <p className="text-sm text-slate-400">Operations Overview</p>
        <h1 className="text-xl font-semibold text-white">Good morning, Captain</h1>
      </div>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-400">
          <Search className="h-4 w-4" />
          <input
            className="w-40 border-0 bg-transparent outline-none placeholder:text-slate-500"
            placeholder="Search"
          />
        </label>
        <button className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-300 transition hover:text-white">
          <Bell className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
