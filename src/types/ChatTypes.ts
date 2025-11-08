// --- Backend DTO Structures ---

// Matches TimeSlotDto from ChatDtos.cs
export interface TimeSlot {
    Date: string;        // e.g., "2025-11-09T00:00:00Z"
    Time: string;        // e.g., "09:00 AM"
    IsAvailable: boolean;
}

// Matches ChatResponseDto from ChatDtos.cs
export interface ChatResponse {
    message: string;
    availableSlots?: TimeSlot[]; // Optional list of TimeSlot objects
}

// --- Internal Frontend State ---

// Matches the Message interface used in ChatWindow.tsx
export interface ChatMessage {
    content: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}