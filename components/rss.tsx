import {
  createElement,
  type ComponentProps,
  type PropsWithChildren,
  type ReactNode,
} from 'react';
import type { MDXComponents } from 'mdx/types';

function Container({ children }: PropsWithChildren) {
  return <div>{children}</div>;
}

function Callout({
  title,
  children,
}: PropsWithChildren<{ title?: ReactNode }>) {
  return (
    <aside>
      {title && <strong>{title}</strong>}
      <div>{children}</div>
    </aside>
  );
}

function Card({
  title,
  description,
  href,
  children,
}: PropsWithChildren<{
  title?: ReactNode;
  description?: ReactNode;
  href?: string;
}>) {
  const content = children ?? (
    <>
      {title && <strong>{title}</strong>}
      {description && <p>{description}</p>}
    </>
  );

  return href ? <a href={href}>{content}</a> : <div>{content}</div>;
}

function Accordion({
  title,
  children,
}: PropsWithChildren<{ title?: ReactNode }>) {
  return (
    <details open>
      {title && <summary>{title}</summary>}
      {children}
    </details>
  );
}

function Image({ src, width, height, ...props }: ComponentProps<'img'>) {
  const asset =
    typeof src === 'object' && src !== null && 'src' in src
      ? (src as unknown as { src: string; width?: number; height?: number })
      : undefined;

  return createElement('img', {
    ...props,
    src: asset?.src ?? src,
    width: width ?? asset?.width,
    height: height ?? asset?.height,
    loading: 'lazy',
  });
}

export const rssComponents = {
  a: 'a',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  img: Image,
  pre: 'pre',
  table: 'table',
  Accordion,
  Accordions: Container,
  Callout,
  CalloutContainer: Callout,
  CalloutDescription: Container,
  CalloutTitle: 'strong',
  Card,
  Cards: Container,
  CodeBlockTab: Container,
  CodeBlockTabs: Container,
  CodeBlockTabsList: Container,
  CodeBlockTabsTrigger: Container,
  Step: 'li',
  Steps: 'ol',
} satisfies MDXComponents;
