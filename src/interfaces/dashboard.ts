export type DashboardWidgetType = 'kpi' | 'series' | 'donut' | 'list' | 'forecast' | 'stats' | 'insights';
export type DashboardFormat = 'money' | 'number' | 'percent' | 'date';

export interface DashboardColumn {
    key:    string;
    label:  string;
    format: DashboardFormat;
}

export interface DashboardWidget {
    key:         string;
    title:       string;
    description: string;
    type:        DashboardWidgetType;
    format:      DashboardFormat;
    size:        number;
    range:       boolean;
    columns?:    DashboardColumn[];
}

export interface DashboardArrangement {
    key:     string;
    visible: boolean;
}

export interface DashboardPeriod {
    from:          string;
    to:            string;
    previous_from: string;
    previous_to:   string;
}

export interface DashboardItem {
    label: string;
    value?: number;
    [key: string]: any;
}

export interface DashboardWidgetData {
    error?:    boolean;
    value?:    number;
    previous?: number | number[] | null;
    percent?:  number | null;
    upward?:   boolean | null;
    extra?:    { [key: string]: any };
    labels?:   string[];
    current?:  number[];
    items?:    DashboardItem[];
    summary?:  { [key: string]: any };
    from?:     string;
    to?:       string;
}

export interface DashboardRangeValues {
    preset:       string;
    option:       string;
    initialDate:  string;
    finalDate:    string;
}

export type DashboardInsightSeverity = 'info' | 'warning' | 'danger';

export interface DashboardInsight {
    id:         string;
    source:     'rule' | 'ai';
    type:       string;
    severity:   DashboardInsightSeverity;
    title:      string;
    body:       string;
    data:       { [key: string]: any } | null;
    action:     string | null;
    updated_at: string;
}
