"use client";

import { useRelativeTime } from "@/hooks/useRelativeTime";


interface TablesTimeI {
  record: any;
  isShow?: boolean;
  rowSearch?: string;
}

export function TablesTime(props: TablesTimeI) {
  const { record, isShow, rowSearch = "updated_at" } = props;
  const relativeTime = useRelativeTime(record[rowSearch]);
  
  if (!isShow) return <></>;

  return (
    <div className="flex w-full h-full text-center text-xs text-danger font-medium">
      {relativeTime}
    </div>
  );
}
