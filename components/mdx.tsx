import type { ComponentProps, JSX } from 'react';
import Link, { type LinkProps } from 'fumadocs-core/link';
import Image from 'next/image';
import {
  Card as FumadocsCard,
  Cards as FumadocsCards,
} from 'fumadocs-ui/components/card';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { CourseInfo } from '@/components/course-info';
import type { CourseInfoData } from '@/lib/types';
import { Files, Folder, File } from '@/components/file-tree';
import { SponsorMarquee } from '@/components/sponsor-marquee';
import { ResourceLibrary } from '@/components/resources';
import { Accordion, Accordions } from '@/components/ui/accordion';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type MdxContext = {
  course?: CourseInfoData;
};

type CardProps = ComponentProps<typeof FumadocsCard> & {
  prefetch?: boolean;
};
const Card = FumadocsCard as (props: CardProps) => JSX.Element;

export function NoPrefetchLink(props: LinkProps) {
  return <Link {...props} prefetch={false} />;
}

function NoPrefetchCard(props: CardProps) {
  // 没有 href 的卡片会渲染成 div，此时不应再带上 prefetch 属性
  return <Card {...props} prefetch={props.href ? false : undefined} />;
}

function Cards(props: ComponentProps<typeof FumadocsCards>) {
  return (
    <FumadocsCards
      {...props}
      className={cn('[&>*:only-child]:col-span-full', props.className)}
    />
  );
}

function SiteIcon({
  className,
  ...props
}: Omit<ComponentProps<typeof Image>, 'width' | 'height'>) {
  return (
    <Image
      {...props}
      width={24}
      height={24}
      className={cn('size-4', className)}
    />
  );
}

export function getMDXComponents(
  components?: MDXComponents,
  context?: MdxContext
) {
  return {
    ...defaultMdxComponents,
    Cards,
    Files,
    Folder,
    File,
    Accordion,
    Accordions,
    Step,
    Steps,
    SiteIcon,
    SponsorMarquee,
    ResourceLibrary,
    Card: NoPrefetchCard,
    CourseInfo: (props: ComponentProps<typeof CourseInfo>) => (
      <CourseInfo {...props} data={props.data ?? context?.course} />
    ),
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
