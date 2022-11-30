import Timestamp from "./Timestamp";

interface Service extends Timestamp{
    id: number;
    title: string;
    price: number;
    description?: string;
}

export default Service;