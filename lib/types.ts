export interface Music {
    id: string;
    title: string;
    artist: string;
    artistId: string;
    album: string;
    genre: string;
    releaseDate: string;
    duration: string;
    coverUrl: string;
    audioUrl: string;
    downloads: number;
    description: string;
    postedBy: string;
    postedAt: string;
    spotifyUrl: string;
    youtubeUrl: string;
    appleMusicUrl: string;
    status?: "pending" | "approved" | "rejected";
    submittedBy?: string;
    submittedAt?: string;
    reviewedBy?: string;
    reviewedAt?: string;
    rejectionReason?: string;
}

export interface MusicSubmission {
    title: string;
    artist: string;
    album?: string;
    genre: string;
    releaseDate?: string;
    description: string;
    audioUrl: string;
    coverUrl?: string;
    submitterName: string;
    submitterEmail: string;
    spotifyUrl?: string;
    youtubeUrl?: string;
    appleMusicUrl?: string;
}

export interface Banner {
    id?: string;
    title: string;
    imageUrl: string;
    linkUrl?: string;
    position: "top" | "middle" | "bottom";
    startDate?: string;
    endDate?: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
}

export interface Announcement {
    id?: string;
    title: string;
    content: string;
    type: "INFO" | "WARNING" | "SUCCESS" | "ERROR";
    isActive: boolean;
    startDate?: string;
    endDate?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
}

export interface Popup {
    id?: string;
    title: string;
    content: string;
    imageUrl?: string;
    buttonText?: string;
    buttonUrl?: string;
    showOnce: boolean;
    startDate?: string;
    endDate?: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
}
