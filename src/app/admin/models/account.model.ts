
export interface StaffAccount {
    id?: string;
    uid?: string;
    staff?: string;
    right?: string;
    login?: Login;
}

interface Login {
    email?: string;
    password?: string;
}
