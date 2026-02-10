import { ProjectAnalytics } from './analytics';

export const MOCK_PROJECTS = [
    { id: 'proj_babarpur_001', name: 'Babarpur Village Scheme', block: 'Awagarh', district: 'Etah', financial_limit: 5000000, start_date: '2025-01-15' },
    { id: 'proj_awagarh_002', name: 'Awagarh Feeder Main', block: 'Awagarh', district: 'Etah', financial_limit: 12000000, start_date: '2025-02-01' },
];

export const MOCK_BOQ_ITEMS = [
    // Pipeline
    { id: 'boq_1', project_id: 'proj_babarpur_001', item_code: 'PIPE-063', description: '63mm HDPE Pipe PN6', unit: 'm', total_quantity: 5000, rate: 120, category: 'Pipeline' },
    { id: 'boq_2', project_id: 'proj_babarpur_001', item_code: 'PIPE-090', description: '90mm HDPE Pipe PN6', unit: 'm', total_quantity: 2500, rate: 240, category: 'Pipeline' },
    { id: 'boq_3', project_id: 'proj_babarpur_001', item_code: 'PIPE-110', description: '110mm HDPE Pipe PN6', unit: 'm', total_quantity: 1000, rate: 380, category: 'Pipeline' },
    // Civil
    { id: 'boq_4', project_id: 'proj_babarpur_001', item_code: 'CIVIL-PH', description: 'Pump House Construction', unit: 'No', total_quantity: 1, rate: 450000, category: 'Civil' },
    { id: 'boq_5', project_id: 'proj_babarpur_001', item_code: 'CIVIL-OHT', description: 'Overhead Tank (200KL)', unit: 'No', total_quantity: 1, rate: 2500000, category: 'Civil' },
    { id: 'boq_6', project_id: 'proj_babarpur_001', item_code: 'CIVIL-BOUND', description: 'Boundary Wall', unit: 'm', total_quantity: 150, rate: 1500, category: 'Civil' },
    // E&M
    { id: 'boq_7', project_id: 'proj_babarpur_001', item_code: 'EM-PUMP', description: 'Submersible Pump 20HP', unit: 'No', total_quantity: 2, rate: 85000, category: 'E&M' },
];

export const MOCK_REPORTS = [
    {
        id: 'rep_001',
        project_id: 'proj_babarpur_001',
        user_id: 'user_mock',
        report_date: new Date().toISOString().split('T')[0],
        work_summary_text: 'Laid 150m of 90mm pipe at Village Entrance',
        discipline: 'Pipeline',
        created_at: new Date().toISOString(),
        projects: { name: 'Babarpur Village Scheme' },
        report_entries: [{ quantity: 150, boq_item_id: 'boq_2' }]
    },
    {
        id: 'rep_002',
        project_id: 'proj_babarpur_001',
        user_id: 'user_mock',
        report_date: new Date().toISOString().split('T')[0],
        work_summary_text: 'Pump House Foundation work in progress (30%)',
        discipline: 'Civil',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        projects: { name: 'Babarpur Village Scheme' },
        report_entries: [{ quantity: 0, stage_percentage: 30, boq_item_id: 'boq_4' }]
    },
    {
        id: 'rep_003',
        project_id: 'proj_babarpur_001',
        user_id: 'user_mock',
        report_date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        work_summary_text: 'Laid 300m of 63mm pipe near School',
        discipline: 'Pipeline',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        projects: { name: 'Babarpur Village Scheme' },
        report_entries: [{ quantity: 300, boq_item_id: 'boq_1' }]
    }
];

export const MOCK_ANALYTICS: ProjectAnalytics = {
    projectId: 'proj_babarpur_001',
    totalBillable: 1250000, // Dummy value
    materialHealth: [
        { itemCode: 'PIPE-063', description: '63mm HDPE Pipe PN6', stock: 5000, consumed: 4500, balance: 500, status: 'Critical' },
        { itemCode: 'PIPE-090', description: '90mm HDPE Pipe PN6', stock: 2500, consumed: 500, balance: 2000, status: 'High' },
        { itemCode: 'PIPE-110', description: '110mm HDPE Pipe PN6', stock: 1000, consumed: 900, balance: 100, status: 'Critical' },
        { itemCode: 'CIVIL-PH', description: 'Pump House', stock: 1, consumed: 0.3, balance: 0.7, status: 'Medium' },
    ],
    progress: [
        { category: 'Pipeline', completed: 5000, target: 8500 },
        { category: 'Civil', completed: 1, target: 3 },
        { category: 'E&M', completed: 0, target: 2 }
    ]
};

// --- Mock Engines ---

export const mockDb = {
    getProjects: async () => [...MOCK_PROJECTS],
    getBOQItems: async (projectId: string) => MOCK_BOQ_ITEMS.filter(i => i.project_id === projectId),
    getRecentReports: async () => [...MOCK_REPORTS],
    getAnalytics: async (projectId: string) => ({ ...MOCK_ANALYTICS, projectId }),
    submitReport: async (data: any) => {
        console.log("MOCK DB: Received Report", data);
        const newReport = {
            id: `rep_${Date.now()}`,
            ...data,
            created_at: new Date().toISOString(),
            projects: MOCK_PROJECTS.find(p => p.id === data.project_id) || { name: 'Unknown' }
        };
        MOCK_REPORTS.unshift(newReport);
        return { success: true, data: newReport };
    }
};
