import UserExchange from "@/api/services/types/UserExchange";

interface ShiftsExchange {
    id: number;
    suggestedDate: string;
    desiredDate: string;
    suggestedShift: number;
    desiredShift: number;
    senderId: number;
    receiverId: number;
    sender: UserExchange,
    receiver: UserExchange,
    createdAt: string;
    updatedAt: string;
}

export default ShiftsExchange;