export interface Violation {
    id: number;
    name: string;
    ordinance_number: string;
    penalties: Array<{
        offense: string;
        amount: number;
    }>;
} 