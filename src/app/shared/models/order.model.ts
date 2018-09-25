
export interface Order {
    id?: string;
    items?: OrderProduct[];
    transactionDetails?: Details;
    datePlaced?: any;
    lastUpdate?: any;
}

interface OrderProduct {
    product?: {
        id?: string;
        pattern?: string;
        unitPrice?: number;
    };
    quantity?: number;
    totalPrice?: number;
    transactionDetails?: Details;
}

export interface Details {
    person?: string;
    transactionType?: string;
    transactionStatus?: string;
    remitStatus?: boolean;
    phoneNumber?: string;
    amountPaid?: number;
    balance?: number;
}
