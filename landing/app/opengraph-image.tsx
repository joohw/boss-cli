import { ImageResponse } from 'next/og'

export const alt = 'Boss直聘自动化工具：候选人管理与批量消息 | boss-cli'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const dynamic = 'force-static'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '88px',
          background: '#020617',
          color: '#f8fafc',
        }}
      >
        <div style={{ display: 'flex', fontSize: 32, fontWeight: 700, marginBottom: 72 }}>
          <span style={{ color: '#14b8a6' }}>boss</span>
          <span>-cli</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 68, fontWeight: 700, lineHeight: 1.15 }}>
          <span>Boss直聘</span>
          <span style={{ color: '#14b8a6' }}>自动化招聘工具</span>
        </div>
        <div style={{ display: 'flex', marginTop: 40, color: '#94a3b8', fontSize: 28 }}>
          候选人管理 · 批量消息 · AI Agent 集成
        </div>
      </div>
    ),
    size,
  )
}
