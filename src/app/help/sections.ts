import content from './help.json';
import { HelpContent } from './types';

export * from './types';

// toda la ayuda sale de help.json, en el mismo orden que el menu lateral
export const SECTIONS = (content as HelpContent).sections;
