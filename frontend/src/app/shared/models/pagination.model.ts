export interface PageInfo {
    pageIndex: number;
    pageSize: number;
    totalItems: number;
}

export interface SortInfo {
    active: string;
    direction: 'asc' | 'desc';
}

export interface FilterInfo {
    [key: string]: any;
}