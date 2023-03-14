import Timestamp from "@/api/services/types/Timestamp";

interface Notification extends Timestamp {
    id: number;
    title: string;
    content: string;
    read: boolean;
}

export default Notification;