'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="px-6 py-12">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
        <div>
          <div className="mb-3">
            <span className="text-teal-500 font-bold text-base">boss</span>
            <span className="text-white font-bold text-base">-cli</span>
          </div>
          <p className="text-slate-500 text-xs">Boss直聘招聘自动化工具 · 开源 · GPL-3.0</p>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <Link href="/blog" className="text-slate-400 hover:text-white transition-colors">博客</Link>
          <a href="https://github.com/joohw/boss-cli" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">GitHub</a>
          <a href="https://www.npmjs.com/package/@joohw/boss-cli" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">NPM</a>
          <a href="https://github.com/joohw/boss-cli/issues" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">Issues</a>
          <a href="https://github.com/joohw/boss-cli/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">许可证</a>
        </div>
      </div>
    </footer>
  )
}
