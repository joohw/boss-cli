import type { MetadataRoute } from 'next'
import { BLOG_POSTS, getAllBlogPosts } from '@/lib/blog'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const postsBySlug = new Map(getAllBlogPosts().map((post) => [post.slug, post]))
  const entries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  for (const post of BLOG_POSTS) {
    const content = postsBySlug.get(post.slug)
    if (!content) {
      throw new Error(`Sitemap blog post is missing content: ${post.slug}`)
    }

    entries.push({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: content.lastModified,
      changeFrequency: 'monthly',
      priority: post.priority,
    })
  }

  return entries
}
