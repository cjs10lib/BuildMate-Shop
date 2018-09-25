export interface Product {
    id?: string;
    pattern?: string;
    description?: string;
    size?: string;
    unitPrice?: number;
    category?: string;
    availableQTY?: number;
    avatar?: string;
    created?: any;
    lastUpdate?: any;
}

export interface ProductStock {
    id?: string;
    product?: string;
    quantity?: number;
    unitCostPrice?: number;
    unitSalePrice?: number;
    invoice?: string;
    supplied?: Date;
    qrySupplied?: number;
    created?: any;
    lastUpdate?: any;
}
