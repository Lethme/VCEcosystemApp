import Timestamp from "./Timestamp";

interface Service extends Timestamp {
    id: number;
    title: string;
    price: number;
    description?: string;
    customerDescription?: string;
}

export default Service;