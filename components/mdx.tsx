import type { ComponentProps, JSX } from 'react';
import Link, { type LinkProps } from 'fumadocs-core/link';
import { Card as FumadocsCard } from 'fumadocs-ui/components/card';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { CourseInfo } from '@/components/course-info';
import type { CourseInfoData } from '@/lib/types';
import { Files, Folder, File } from '@/components/file-tree';
import { Accordion, Accordions } from '@/components/ui/accordion';
import { Step, Steps } from 'fumadocs-ui/components/steps';
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
  return <Card {...props} prefetch={false} />;
}

export function getMDXComponents(
  components?: MDXComponents,
  context?: MdxContext
) {
  return {
    ...defaultMdxComponents,
    Files,
    Folder,
    File,
    Accordion,
    Accordions,
    Step,
    Steps,
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
