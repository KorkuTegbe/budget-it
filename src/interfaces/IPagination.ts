export interface IPagination {
    page: number;
    size: number;
    totalCount: number;
    lastPage: number;
}

export interface ISearchQuery {
    name?: string,
    region?: string,
    town?: string,
    specialties?: string,
    approach?: string,
    page?: number,
    per_page?: number
}