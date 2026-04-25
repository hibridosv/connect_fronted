export interface ViewTitleSmProps {
  text: string;
}

export function ViewTitleSm(props: ViewTitleSmProps) {
  const { text } = props;
  
  return (<div className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">{text}</div>);
}
