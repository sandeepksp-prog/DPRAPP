export const LANDING_DATA = {
    overall: {
        totalSchemes: 124,
        completed: 45,
        inProgress: 68,
        notStarted: 11,
        financials: {
            allocation: 450.5, // Cr
            utilization: 125.2, // Cr
            pending: 325.3 // Cr
        },
        manpower: 1250,
        machinery: 85
    },
    schemes: [
        { id: 'S001', name: 'Nagla Bhajua Water Supply', block: 'Shitalpur', status: 'In Progress', progress: 65, cost: 2.5, type: 'Retrofitting' },
        { id: 'S002', name: 'Sarai Aghat Pipe Network', block: 'Sakit', status: 'Completed', progress: 100, cost: 1.8, type: 'New Scheme' },
        { id: 'S003', name: 'Nidhauli Kalan OHT', block: 'Nidhauli Kalan', status: 'In Progress', progress: 42, cost: 3.2, type: 'OHT Construction' },
        { id: 'S004', name: 'Awagarh FHTC', block: 'Awagarh', status: 'Not Started', progress: 0, cost: 1.5, type: 'FHTC' },
        { id: 'S005', name: 'Jalesar Intake Well', block: 'Jalesar', status: 'In Progress', progress: 88, cost: 4.1, type: 'Intake' },
        { id: 'S006', name: 'Marehra Distribution', block: 'Marehra', status: 'Completed', progress: 100, cost: 2.2, type: 'Distribution' }
    ],
    store: {
        inventory: [
            { item: 'HDPE Pipe 110mm', stock: 5000, unit: 'm', status: 'Adequate' },
            { item: 'DI Pipe 200mm', stock: 120, unit: 'm', status: 'Low' },
            { item: 'FHTC Taps', stock: 2500, unit: 'pcs', status: 'Adequate' },
            { item: 'Cement (OPC)', stock: 450, unit: 'bags', status: 'Critical' }
        ]
    },
    billing: {
        invoices: [
            { id: 'INV-2024-001', vendor: 'Jindal Saw Ltd.', amount: 45.2, status: 'Paid', date: '2024-01-15' },
            { id: 'INV-2024-002', vendor: 'UltraTech Cement', amount: 12.5, status: 'Pending', date: '2024-02-01' },
            { id: 'INV-2024-003', vendor: 'Local Labour Contractor', amount: 5.8, status: 'Processing', date: '2024-02-10' }
        ]
    },
    stats: [
        { label: "Households Covered", value: "45,230", trend: "+12%" },
        { label: "Pipe Laid (km)", value: "1,240", trend: "+5%" },
        { label: "Pump Houses", value: "32/45", trend: "71%" },
        { label: "Avg. Daily Progress", value: "2.4 km", trend: "-1%" }
    ]
};
