"use client";
import { Spinner } from "@/components/Spinner";

import { useGetRequest } from '@/hooks/request/useGetRequest';
import { useEffect } from 'react';

export interface ButtonDownloadGetProps {
  href: string;
  children: any;
  titleText?: string;
  autoclass?: boolean;
  style?: string;
}

export function ButtonDownloadGet({ href, children, titleText = "Descargar", autoclass = true, style = "" }: ButtonDownloadGetProps) {
  const { responseData, loading, getRequest } = useGetRequest();

  useEffect(() => {
    if (responseData?.url) {
      window.open(responseData.url, '_blank');
    }
  }, [responseData]);

  const handleClick = () => {
    if (!href  || loading) return;
    getRequest(`config/url?${href}`, false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`${autoclass ? 'button-href ' : 'clickeable '} ${style}`}
      title={titleText}
    >
      {loading ? <Spinner color="current" /> : children}
    </button>
  );
}
