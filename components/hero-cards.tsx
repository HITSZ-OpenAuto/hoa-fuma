'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LazyMotion, domAnimation, m } from 'motion/react';

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

const TOP_CARD_INDEX = 2;
const TOP_DELAY = 0.4;
const TOP_DURATION = 1.2;
const STAGGER = 0.1;
const BACK_CARD_START_DELAY = TOP_DELAY + TOP_DURATION * 0.1;

function HeroCard({ linkTo, content, imageURL, index }: HeroCardProps) {
  const isTopCard = index === TOP_CARD_INDEX;
  const delay = isTopCard
    ? TOP_DELAY
    : BACK_CARD_START_DELAY + (TOP_CARD_INDEX - 1 - index) * STAGGER;

  return (
    <m.div
      initial={{
        x: 0,
        rotate: 0,
        y: 24,
        ...(isTopCard ? {} : { opacity: 0 }),
      }}
      animate={{
        x: index * 40,
        rotate: index * 8,
        y: 0,
        ...(isTopCard ? {} : { opacity: 1 }),
      }}
      whileHover={{ y: -12, zIndex: 50 }}
      transition={{
        delay,
        duration: TOP_DURATION,
        ease: [0.16, 1, 0.3, 1],
        y: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
        zIndex: { duration: 0 },
        ...(isTopCard ? {} : { opacity: { duration: 0.5, ease: 'easeOut' } }),
      }}
      className="absolute"
      style={{ zIndex: index + 1, transformOrigin: 'bottom center' }}
    >
      <Link href={linkTo} className={cn('hero-card group', 'block h-72 w-lg')}>
        <div className="sticky-label">
          <span>{content}</span>
        </div>

        <div className="hero-card-body relative h-full w-full overflow-hidden transition-shadow duration-300 group-hover:shadow-xl">
          <Image
            src={imageURL}
            alt={content}
            fill
            className="object-cover object-top"
            sizes="100vw"
            loading="eager"
          />
        </div>
      </Link>
    </m.div>
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
        loading="eager"
      />
    </div>
  );
}

export function HeroCards() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="block lg:hidden">
        <MobileLogo />
      </div>

      <div
        className={cn(
          'hero-cards-container relative',
          'hidden lg:block',
          'h-80 w-96',
          'xl:-ml-12'
        )}
      >
        {[...cards].reverse().map((card, reversedIndex) => {
          const index = cards.length - 1 - reversedIndex;
          return <HeroCard key={card.linkTo} {...card} index={index} />;
        })}
      </div>
    </LazyMotion>
  );
}
