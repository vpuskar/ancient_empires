'use client';

import { useRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, useInView } from 'framer-motion';

const mdComponents = {
  h1: (props: ComponentPropsWithoutRef<'h1'>) => (
    <h1
      className="mb-4 mt-8 font-display text-3xl font-bold text-[#C9A84C]"
      {...props}
    />
  ),
  h2: (props: ComponentPropsWithoutRef<'h2'>) => (
    <h2
      className="mb-3 mt-7 border-l-4 border-[#C9A84C] pl-4 font-display text-2xl font-bold text-[#F0ECE2]"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<'h3'>) => (
    <h3 className="mb-2 mt-6 text-xl font-semibold text-[#8B7355]" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<'p'>) => (
    <p className="mb-4 leading-relaxed text-[#F0ECE2]/85" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote
      className="my-6 border-l-4 border-[#8B0000] bg-[#1A1510] px-6 py-4 italic text-[#F0ECE2]/90"
      {...props}
    />
  ),
  ul: (props: ComponentPropsWithoutRef<'ul'>) => (
    <ul className="mb-4 ml-1 list-none space-y-2" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<'ol'>) => (
    <ol className="mb-4 ml-1 list-none space-y-2" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<'li'>) => (
    <li className="flex gap-2 text-[#F0ECE2]/85">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A84C]" />
      <span>{props.children}</span>
    </li>
  ),
  strong: (props: ComponentPropsWithoutRef<'strong'>) => (
    <strong className="font-semibold text-[#F0ECE2]" {...props} />
  ),
  a: (props: ComponentPropsWithoutRef<'a'>) => (
    <a
      className="text-[#C9A84C] underline decoration-[#C9A84C]/30 transition hover:decoration-[#C9A84C]"
      {...props}
    />
  ),
  hr: () => (
    <div className="my-8 flex items-center gap-4">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />
      <span className="text-[#C9A84C]/40">◆</span>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />
    </div>
  ),
};

interface Props {
  content: string;
  delay?: number;
}

export function ChapterReader({ content, delay = 0 }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
        {content}
      </ReactMarkdown>
    </motion.div>
  );
}
