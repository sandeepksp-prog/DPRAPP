import { supabase } from './supabaseClient';

export interface ProjectAnalytics {
    projectId: string;
    totalBillable: number;
    materialHealth: {
        itemCode: string;
        description: string;
        stock: number; // For now total_quantity as proxy for stock/limit
        consumed: number;
        balance: number;
        status: 'High' | 'Medium' | 'Critical';
    }[];
    progress: {
        category: string;
        completed: number;
        target: number;
    }[];
}

export async function getProjectAnalytics(projectId: string): Promise<ProjectAnalytics> {
    // 1. Fetch BOQ Items (The "Limit" / "Estimate")
    const { data: boqItems, error: boqError } = await supabase
        .from('boq_items')
        .select('*')
        .eq('project_id', projectId);

    if (boqError) throw boqError;

    // 2. Fetch Reported Entries (The "Actuals")
    // We need to join with daily_reports to filter by project_id if report_entries doesn't have it directly.
    // schema says report_entries -> daily_reports(project_id)
    const { data: reports, error: reportError } = await supabase
        .from('report_entries')
        .select(`
      quantity,
      stage_percentage,
      boq_item_id,
      daily_reports!inner(project_id)
    `)
        .eq('daily_reports.project_id', projectId);

    if (reportError) throw reportError;

    // 3. Calculate Billable Amount
    // Sum of (Reported Qty * Rate)
    let totalBillable = 0;
    const consumptionMap: Record<string, number> = {}; // boq_id -> total_qty

    reports?.forEach((entry: any) => {
        if (entry.boq_item_id) {
            consumptionMap[entry.boq_item_id] = (consumptionMap[entry.boq_item_id] || 0) + Number(entry.quantity);
        }
    });

    // 4. Material Health & Financials
    const materialHealth = boqItems?.map(item => {
        const consumed = consumptionMap[item.id] || 0;
        const rate = item.rate || 0;

        totalBillable += (consumed * rate);

        const balance = (item.total_quantity || 0) - consumed;
        const percentLeft = (balance / (item.total_quantity || 1)) * 100;

        let status: 'High' | 'Medium' | 'Critical' = 'High';
        if (percentLeft < 10) status = 'Critical';
        else if (percentLeft < 30) status = 'Medium';

        return {
            itemCode: item.item_code,
            description: item.description,
            stock: item.total_quantity,
            consumed,
            balance,
            status
        }
    }) || [];

    // 5. Category Progress
    // Group boqItems by category
    const categories = ['Pipeline', 'Civil', 'E&M'];
    const progress = categories.map(cat => {
        const itemsInCat = boqItems?.filter(i => i.category === cat) || [];
        const totalTarget = itemsInCat.reduce((sum, i) => sum + (i.total_quantity || 0), 0);
        const totalDone = itemsInCat.reduce((sum, i) => sum + (consumptionMap[i.id] || 0), 0);

        return {
            category: cat,
            completed: totalDone,
            target: totalTarget
        };
    });

    return {
        projectId,
        totalBillable,
        materialHealth,
        progress
    };
}
