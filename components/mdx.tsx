import React, { type ComponentProps, type JSX } from 'react';
import Link, { type LinkProps } from 'fumadocs-core/link';
import { Card as FumadocsCard } from 'fumadocs-ui/components/card';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import {
  CourseInfo,
  CourseSkeleton,
  CourseHealthDashboard,
} from '@/components/course-info';
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

import { ElectiveCourseTaxonomy } from '@/components/course-info/elective-course-taxonomy';
import { ProjectRenamingBanner } from '@/components/docs/project-renaming-banner';
import { MergedCourseBanner } from '@/components/course-info/merged-course-banner';
import { CourseReviewBadge } from '@/components/course-info/course-review-badge';
import { ScrollSpyTOC } from '@/components/docs/scroll-spy-toc';
import { ShareDrawer } from '@/components/docs/share-drawer';
import { MobileQuickNav } from '@/components/docs/mobile-quick-nav';
import { ImageZoom } from '@/components/image-zoom';
import { CodeBlockActions } from '@/components/code-block-actions';
import { PageFeedback } from '@/components/docs/page-feedback';
import { formatLaTeX } from '@/lib/math-renderer';

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

function CustomPre(props: ComponentProps<'pre'>) {
  const childrenArray = React.Children.toArray(props.children);
  let codeText = '';
  let language = '';

  for (const child of childrenArray) {
    if (React.isValidElement(child)) {
      const childProps = child.props as {
        children?: React.ReactNode;
        className?: string;
      };
      if (childProps.children) {
        if (typeof childProps.children === 'string') {
          codeText = childProps.children;
        } else if (Array.isArray(childProps.children)) {
          codeText = childProps.children.join('');
        }
      }
      if (childProps.className) {
        const match = /language-([^\s]+)/.exec(childProps.className);
        if (match) {
          language = match[1];
        }
      }
    }
  }

  const DefaultPre = defaultMdxComponents.pre || 'pre';

  return (
    <div className="group border-fd-border bg-fd-card relative my-4 overflow-hidden rounded-xl border">
      {codeText ? (
        <CodeBlockActions code={codeText} language={language} />
      ) : null}
      <DefaultPre
        {...props}
        className={`overflow-x-auto p-4 ${props.className || ''}`}
      />
    </div>
  );
}

function KaTeXMath({ math, block = false }: { math: string; block?: boolean }) {
  const html = formatLaTeX(math, block);
  return (
    <span
      dangerouslySetInnerHTML={{ __html: html }}
      className={
        block
          ? 'katex-display-block my-4 flex justify-center overflow-x-auto'
          : 'katex-inline'
      }
    />
  );
}

export function getMDXComponents(
  components?: MDXComponents,
  context?: MdxContext
) {
  return {
    ...defaultMdxComponents,
    img: (props: ComponentProps<'img'>) => <ImageZoom {...props} />,
    pre: CustomPre,
    Math: KaTeXMath,
    PageFeedback,
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
    CourseSkeleton,
    CourseHealthDashboard,
    ShareDrawer,
    MobileQuickNav,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
    ElectiveCourseTaxonomy,
    ProjectRenamingBanner,
    MergedCourseBanner,
    CourseReviewBadge,
    ScrollSpyTOC,
    ...components,
  } satisfies MDXComponents;
}

export {
  PageFeedback,
  ImageZoom,
  CodeBlockActions,
  KaTeXMath as Math,
  CourseSkeleton,
  CourseHealthDashboard,
  ShareDrawer,
  MobileQuickNav,
};

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
