import { ArrowIcon } from '@/components/ArrowIcon';
import Link from 'next/link';
import type { Article } from '@/content/types';
export function ArticleCards({ articles }: { articles: Article[] }) {
  return (
    <div className="article-cards">
      {articles.map((a) => (
        <article key={a.id}>
          <h3>
            <Link href={`/post/${a.slug}`}>{a.title}</Link>
          </h3>
          <p>{a.summary}</p>
          <Link className="text-link" href={`/post/${a.slug}`}>
            Read the guide <ArrowIcon direction="up-right" />
          </Link>
        </article>
      ))}
    </div>
  );
}
