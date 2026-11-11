import Link from 'next/link';
import React from 'react';

export interface LiComponentI {
  onClick?: () => void;
  href?: string;
  link?: string;
  text?: string;
  content?: React.ReactNode;
  target?: string;
  style?: string;
}

export const iconSvg = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

export function LiComponent(props: LiComponentI) {
  const { text, onClick, href, link, target="_blank", content, style } = props;

  const commonClasses = "flex justify-between items-center p-3 hover:bg-bg-subtle rounded-md transition-colors duration-150";


  if (href) {
    return (
      <li>
        <a href={href} className={`${commonClasses} clickeable-table ${style}`} target={target}>
          <span className="font-medium text-text-base">{text}{content}</span>
          {iconSvg}
        </a>
      </li>
    );
  }

  if (link) {
    return (
      <li>
        <Link href={link} className={`${commonClasses} clickeable-table ${style}`}>
          <span className="font-medium text-text-base">{text}{content}</span>
          {iconSvg}
        </Link>
      </li>
    );
  }

  if (onClick) {
    return (
      <li>
        <button type="button" onClick={onClick} className={`${commonClasses} w-full text-left clickeable-table ${style}`}>
          <span className="font-medium text-text-base">{text}{content}</span>
          {iconSvg}
        </button>
      </li>
    );
  }

  // Default case if neither href nor onClick is provided
  return (
    <li>
      <div className={`${commonClasses} ${style}`}>
        <span className="font-medium text-text-base">{text}{content}</span>
        {iconSvg}
      </div>
    </li>
  );
}