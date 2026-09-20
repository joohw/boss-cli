'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-6">
      <div className="max-w-6xl mx-auto h-16 flex items-center justify-between">
        <Link href="/" aria-label="boss-cli 首页">
          <span className="text-teal-500 font-bold text-lg">boss</span>
          <span className="text-white font-bold text-lg">-cli</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-slate-400 hover:text-white text-sm transition-colors">功能</a>
          <a href="#examples" className="text-slate-400 hover:text-white text-sm transition-colors">示例</a>
          <a href="#faq" className="text-slate-400 hover:text-white text-sm transition-colors">常见问题</a>
          <Link href="/blog" className="text-slate-400 hover:text-white text-sm transition-colors">博客</Link>
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/joohw/boss-cli"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            title="GitHub"
            className="inline-flex h-8 w-8 items-center justify-center text-slate-400 transition-colors hover:text-white"
          >
            <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-current">
              <path d="M12 1.5a10.5 10.5 0 0 0-3.32 20.46c.52.1.71-.22.71-.5v-1.78c-2.9.63-3.51-1.23-3.51-1.23-.47-1.2-1.16-1.52-1.16-1.52-.95-.64.07-.63.07-.63 1.06.08 1.61 1.09 1.61 1.09.93 1.6 2.44 1.14 3.03.87.1-.68.36-1.14.65-1.4-2.32-.26-4.75-1.16-4.75-5.17 0-1.14.4-2.08 1.09-2.82-.11-.27-.47-1.35.1-2.81 0 0 .88-.28 2.9 1.08a9.99 9.99 0 0 1 5.29 0c2.02-1.36 2.9-1.08 2.9-1.08.57 1.46.21 2.54.1 2.81.68.74 1.09 1.68 1.09 2.82 0 4.02-2.44 4.9-4.77 5.16.37.32.7.93.7 1.88v2.8c0 .28.18.61.72.5A10.5 10.5 0 0 0 12 1.5Z" />
            </svg>
          </a>
          <a
            href="https://www.npmjs.com/package/@joohw/boss-cli"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-md transition-colors"
          >
            立即安装
          </a>
        </div>
      </div>
    </header>
  )
}
