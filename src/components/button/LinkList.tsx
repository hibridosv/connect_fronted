'use client';

import { LuLoader } from "react-icons/lu";
import { LiComponent } from "./LiComponent";

export interface LinkUrls {
  name: string;
  link: string;
  isUrl?: boolean;
  loading?: boolean;
  _id?: string;
}

export interface LinksListProps {
  links: LinkUrls[];
  text?: string;
}

export function LinksList(props: LinksListProps) {
  const { links, text = "Descargas" } = props;

  if (!links || links.length === 0) {
    return null;
  }

  return (
    <div className='my-5 bg-bg-content rounded-lg shadow-sm border border-bg-subtle/50'>
      <div className="p-4 border-b border-bg-subtle">
        <h3 className="text-base font-semibold text-text-base">{text}</h3>
      </div>
      <ul className="divide-y divide-bg-subtle">
        {links.map((item, key) => {
          if (item.loading) {
            return (
              <li key={key} className="flex justify-between items-center p-3">
                <span className="font-medium text-text-muted">{item.name}</span>
                <LuLoader className="animate-spin text-text-muted" size={16} />
              </li>
            );
          }
          if (item.name && item.link) {
            return (
              <LiComponent key={key} text={item.name} href={`${item.link}`} />
            );
          }
          return null;
        })}
      </ul>
    </div>
  );
}
