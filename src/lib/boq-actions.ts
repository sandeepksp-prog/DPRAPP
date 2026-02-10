import { supabase } from './supabaseClient';

export interface BOQItemInput {
    item_code: string;
    description: string;
    unit: string;
    total_quantity: number;
    rate: number;
}

export async function bulkInsertBOQ(projectId: string, items: BOQItemInput[]) {
    if (!projectId) throw new Error("Project ID is required");
    if (!items || items.length === 0) throw new Error("No items to insert");

    // Chunking to avoid payload limits (Supabase default is robust, but safe to chunk 1000s)
    const chunkSize = 100;
    let successCount = 0;
    let errors: any[] = [];

    for (let i = 0; i < items.length; i += chunkSize) {
        const chunk = items.slice(i, i + chunkSize).map(item => ({
            ...item,
            project_id: projectId
        }));

        const { error } = await supabase
            .from('boq_items')
            .insert(chunk);

        if (error) {
            console.error(`Error inserting chunk ${i}:`, error);
            errors.push(error);
        } else {
            successCount += chunk.length;
        }
    }

    return { success: errors.length === 0, count: successCount, errors };
}
