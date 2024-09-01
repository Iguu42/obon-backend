export interface Asset { 
    id: string; 
    eventId: string;
    type: string;
    url: string; 
    description: string | null;
}
export interface AssetCreate { 
    eventId: string;
    type: string;
    url: string;
    description: string | null;
}
export interface AssetRepository {
    createAsset(data: AssetCreate): Promise<Asset>;
    deleteAsset(id: string): Promise<void>;
}