import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import StructuredData from '@/components/StructuredData'
import { blogBySlug, BLOG_POSTS, buildBlogPostingJsonLd, getBlogPost } from '@/lib/blog'
import { renderMarkdown } from '@/lib/markdown'
import { SITE_URL, SOCIAL_IMAGE } from '@/lib/site'

type PageProps = {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}

  const url = `${SITE_URL}/blog/${post.slug}`

  return {
    title: post.title,
    description: post.description || undefined,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.description || undefined,
      locale: 'zh_CN',
      publishedTime: post.date || undefined,
      images: [SOCIAL_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description || undefined,
      images: [SOCIAL_IMAGE],
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  if (!blogBySlug(slug)) notFound()

  const post = getBlogPost(slug)
  if (!post) notFound()

  const html = await renderMarkdown(post.body)
  const jsonLd = buildBlogPostingJsonLd(slug)

  return (
    <div className="bg-slate-950 min-h-screen">
      <StructuredData data={jsonLd} />
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 pt-28 pb-16">
        <Link href="/blog" className="text-sm text-slate-400 hover:text-white transition-colors">
          ← 返回博客
        </Link>
        <article className="mt-6">
          <header className="mb-8 max-w-none">
            <h1 className="text-3xl font-bold text-white mb-3">{post.title}</h1>
            {post.date ? <time className="text-slate-500 text-sm">{post.date}</time> : null}
            {post.description ? (
              <p className="mt-4 text-base leading-relaxed text-slate-400">{post.description}</p>
            ) : null}
          </header>
          <div className="blog-prose" dangerouslySetInnerHTML={{ __html: html }} />
        </article>
      </main>
      <Footer />
    </div>
  )
}
