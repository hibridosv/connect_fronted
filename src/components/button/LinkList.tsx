'use client';

import { get } from '@/services/httpService';
import { useState } from 'react';
import { LuDownload, LuLoader } from 'react-icons/lu';

export interface LinkUrls {
  name: string;
  link?: string;
  route?: string;
  isUrl?: boolean;
  loading?: boolean;
  _id?: string;
}

export interface LinksListProps {
  links: LinkUrls[];
  text?: string;
}

function LinkItem({ item }: { item: LinkUrls }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await get(`config/url?route=${item.route}`);
      const resolvedUrl = response.data?.url;
      if (resolvedUrl) window.location.href = resolvedUrl;
    } finally {
      setLoading(false);
    }
  };

  const commonClasses = 'flex justify-between items-center p-3 hover:bg-bg-subtle rounded-md transition-colors duration-150 w-full text-left clickeable';

  return (
    <li>
      <button type="button" onClick={handleClick} disabled={loading} className={commonClasses}>
        <span className="font-medium text-text-base">{item.name}</span>
        {loading ? <LuLoader className="animate-spin text-text-muted" size={16} /> : <LuDownload className="text-text-muted" size={16} />}
      </button>
    </li>
  );
}

export function LinksList(props: LinksListProps) {
  const { links, text = "Descargas" } = props;

  if (!links || links.length === 0) return null;

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
          if (item.name && item.route) {
            return <LinkItem key={key} item={item} />;
          }
          return null;
        })}
      </ul>
    </div>
  );
}
