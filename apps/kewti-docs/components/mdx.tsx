import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { BlockPreview } from './blockpreview';
import { Tabs, Tab } from 'fumadocs-ui/components/tabs';
import { CodePlayground } from './livepreview';
import Link from 'next/link';
export function getMDXComponents(components?: MDXComponents) {
  const FONTS_PAGE = () => { return <Link href={`${process.env.NEXT_PUBLIC_LANDING_URL}/fonts`}>Here</Link> };
  const API_URL = process.env.NEXT_PUBLIC_LANDING_URL || "https://example.com";

  return {
    ...defaultMdxComponents,
    ...components,
    CodePlayground,
    BlockPreview,
    FONTS_PAGE,
    API_URL: () => <>{API_URL}</>,
    Tabs,
    Tab
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
