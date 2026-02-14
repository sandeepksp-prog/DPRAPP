
// Brigade Group - Dashboard Dummy Data
// Replicating values from provided screenshots for pixel-perfect UI matching

export const BRIGADE_DATA = {
    // FINANCIALS WIDGET
    financials: {
        receivedVsPaid: {
            totalReceived: 13.80, // Cr
            totalPaid: 12.20,     // Cr
            series: [
                { month: 'Jun 24', received: 1.8, paid: 1.2 },
                { month: 'Jul 24', received: 2.2, paid: 1.8 },
                { month: 'Aug 24', received: 1.5, paid: 1.4 },
                { month: 'Sep 24', received: 2.8, paid: 2.1 }, // Spike
                { month: 'Oct 24', received: 1.9, paid: 1.6 },
                { month: 'Nov 24', received: 2.4, paid: 2.0 },
                { month: 'Dec 24', received: 1.2, paid: 2.1 }, // Dip
            ]
        },
        stats: {
            boqAchieved: 6.54,   // Cr
            totalReceived: 6.29, // Cr
            totalPayable: 6.44,  // Cr
        },
        stackedBar: [
            { project: 'Volvo Bhopal', boq: 1.8, received: 1.7, payable: 1.8, paid: 1.6, color: '#FCD34D' }, // Yellow/Gold
            { project: 'Blue Powerplant', boq: 2.4, received: 2.2, payable: 2.3, paid: 2.1, color: '#60A5FA' }, // Blue
            { project: 'Delhi Metro Station', boq: 2.3, received: 2.4, payable: 2.3, paid: 2.2, color: '#EC4899' }, // Pink
        ]
    },

    // PAYABLES WIDGET
    payables: {
        recorded: 2.02, // Cr
        amountPaid: 1.02, // Cr
        totalDue: 1.00, // Cr
        totalOverdue: 700240, // ₹
        trend: '+12.00000 last cycle', // Green up arrow
    },

    // EXPENSES WIDGET (Donut)
    expenses: {
        total: 1.03, // Cr
        last3Months: true,
        breakdown: [
            { category: 'Material', amount: 47.80, unit: 'L', color: '#8B5CF6' }, // Purple
            { category: 'Sub-Contractor', amount: 26.00, unit: 'L', color: '#EC4899' }, // Pink
            { category: 'Manpower', amount: 10.87, unit: 'L', color: '#F59E0B' }, // Orange
            { category: 'Unused advance', amount: 300240, unit: '₹', color: '#F97316' }, // Orange-Red
            { category: 'Miscellaneous', amount: 16.12, unit: 'L', color: '#3B82F6' }, // Blue
        ]
    },

    // PROJECTS LIST
    projects: [
        {
            name: 'Volvo Bhopal',
            alert: 7, // Red warning triangle
            dates: '12 Jan 2024 - 1 Jul 2024 • 17 days left',
            progress: 66,
            status: '14 Delayed tasks',
            color: '#FCD34D', // Light blue bg in UI but icon color
        },
        {
            name: 'Delhi Metro Station',
            alert: 7,
            dates: '1 Aug 2023 - 1 Mar 2025 • 3 months left',
            progress: 7,
            status: 'No delay tracking',
            color: '#EC4899',
        },
        {
            name: 'Blue Powerplant',
            buttons: true,
            dates: '21 Sep 2023 - 31 Dec 2023',
            progress: 79,
            status: '12 Delayed tasks',
            color: '#60A5FA',
        }
    ],

    // PARTNERS (Vendors/Labours)
    vendors: [
        { name: 'HVAC Contractor', type: 'Subcontractor', advanceLeft: '3,20,000', totalDue: '1,80,000' },
        { name: 'Shah Hardware', type: 'Material', advanceLeft: '3,20,000', totalDue: '1,20,000' },
        { name: 'Ramesh Contractors', type: 'Labour • Subcontractor', advanceLeft: '3,20,000', totalDue: '80,000' },
    ],

    // INDENTS & PO
    indents: {
        created: { count: 29, trend: '5 this last month', sentiment: 'up' },
        pendingApproval: { count: 5, sentiment: 'bad' }, // Red number
        pendingPO: { count: 7 },
        deliveryPending: { count: 4 }
    },

    purchaseOrders: {
        approvedAmount: '51,91,000',
        payableRecorded: '52,91,000',
        created: { count: 38, trend: '5 this last month', sentiment: 'up' },
        pendingApproval: { count: 5, sentiment: 'bad' },
        deliveryPending: { count: 4 },
        pendingPayable: { count: 4 }
    },

    // TASKS
    tasks: {
        notStarted: { count: 755, delayed: 31 },
        inProgress: { count: 122, delayed: 11 }, // Highlighted orange card
        delayed: { count: 54 },
        completed: { count: 332, delivered: 12 },
        endingNext7Days: { count: 47 },
        scheduledNext7Days: { count: 38 }
    },

    // ISSUES & TEAM
    issues: {
        total: { count: 32, trend: '2 this last month', sentiment: 'down' }, // Green arrow down (good)
        open: { count: 11, alert: '3 beyond due date', sentiment: 'bad' },
        closed: { count: 21, alert: '12 after due date', sentiment: 'neutral' }
    },
    team: {
        active: '4 / 8',
        pending: 1,
        chartData: [4, 6, 5, 8, 3, 4, 4] // Sparkline
    },

    // BOQ DATA
    boq: {
        summary: {
            received: '₹8,85,10,000.00',
            boqAchievedQty: '₹25,44,346.00',
            totalBOQ: '₹6,80,90,945.00',
            budgetAchievedQty: '₹25,43,048.23',
            totalBudget: '₹6,80,83,213.94'
        },
        items: [
            {
                code: 'A',
                description: 'Civil & Interior',
                isGroup: true,
                children: [
                    {
                        code: '1',
                        description: 'FINISHING WORK',
                        isGroup: true,
                        children: [
                            {
                                code: '1.01',
                                description: 'Providing and applying white cement based putty of average thickness 1 mm, of approved brand and ...',
                                totalQty: '3664 sqm',
                                achievedQty: '3664 sqm',
                                budgetAmount: '₹3,55,041.60',
                                boqAmount: '₹3,55,408.00'
                            },
                            {
                                code: '1.02',
                                description: 'P.O.P. Punning:- Providing and applying 6-10 mm thk. P.O.P. punning over ...',
                                totalQty: '1370 sqm',
                                achievedQty: '1059 sqm',
                                budgetAmount: '₹2,75,265.87',
                                boqAmount: '₹2,75,340.00',
                                hasAddButton: true
                            }
                        ]
                    }
                ]
            }
        ]
    }
};
