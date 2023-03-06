interface ShiftsExchangeRequestDto {
    suggestedDate: Date,
    desiredDate: Date,
    suggestedShift: number,
    desiredShift: number,
    senderId: number,
    receiverId: number;
}

export default ShiftsExchangeRequestDto;