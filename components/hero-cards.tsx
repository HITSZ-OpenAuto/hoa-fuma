import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type CardData = {
  linkTo: string;
  content: string;
  imageURL: string;
};

const cards: CardData[] = [
  { linkTo: '/news', content: '新闻', imageURL: '/images/news.png' },
  { linkTo: '/blog', content: '博客', imageURL: '/images/blog.png' },
  { linkTo: '/docs', content: '文档', imageURL: '/images/docs.png' },
];

type HeroCardProps = CardData & {
  index: number;
};

function HeroCard({ linkTo, content, imageURL, index }: HeroCardProps) {
  return (
    <Link
      href={linkTo}
      className={cn('hero-card group absolute', 'h-72 w-lg')}
      style={{ '--card-index': index } as React.CSSProperties}
    >
      <div className="sticky-label">
        <span>{content}</span>
      </div>

      {/* Image content */}
      <div className="hero-card-body relative h-full w-full overflow-hidden transition-shadow duration-300 group-hover:shadow-xl">
        <Image
          src={imageURL}
          alt={content}
          fill
          className="object-cover object-top"
          sizes="208px"
        />
      </div>
    </Link>
  );
}

function MobileLogo() {
  return (
    <div className="flex items-center justify-center">
      <Image
        src="/HITSZOpenAuto-Shadow.png"
        alt="HITSZ OpenAuto"
        width={280}
        height={160}
        className="h-auto w-70 dark:opacity-90 dark:brightness-110"
        priority
      />
    </div>
  );
}

export function HeroCards() {
  return (
    <>
      {/* Mobile: show logo */}
      <div className="block lg:hidden">
        <MobileLogo />
      </div>

      {/* Desktop: card layout */}
      <div
        className={cn(
          'hero-cards-container relative',
          'hidden lg:block',
          'h-80 w-96',
          '-ml-12'
        )}
      >
        {cards.map((card, index) => (
          <HeroCard key={card.linkTo} {...card} index={index} />
        ))}
      </div>
    </>
  );
}
