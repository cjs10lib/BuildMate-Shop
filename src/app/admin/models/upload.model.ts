
export interface Upload {
    Id?: string;
    sourceId?: string;
    tag?: string; // can be product, staff or project
    note?: string;
    url?: string;
    path?: string;
    progress?: number;
    createdDate?: Date;
}

