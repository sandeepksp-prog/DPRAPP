export interface GanttScheme {
    id: string;
    name: string;
    status: 'O&M Started' | 'WIP' | 'Planned';
    start: string;
    end: string;
    priority: number;
}

export const GANTT_PRIORITY_SCHEMES: GanttScheme[] = [
    {
        "id": "1",
        "name": "VIRAMPUR ETAH",
        "status": "O&M Started",
        "start": "2025-09-08",
        "end": "2025-11-07",
        "priority": 1
    },
    {
        "id": "2",
        "name": "NAGALA FARID",
        "status": "O&M Started",
        "start": "2025-09-06",
        "end": "2025-11-04",
        "priority": 2
    },
    {
        "id": "3",
        "name": "SUPAITI",
        "status": "O&M Started",
        "start": "2025-09-03",
        "end": "2025-11-04",
        "priority": 3
    },
    {
        "id": "4",
        "name": "MUMIYA KHERA",
        "status": "O&M Started",
        "start": "2025-09-03",
        "end": "2025-11-04",
        "priority": 4
    },
    {
        "id": "5",
        "name": "PALIA",
        "status": "O&M Started",
        "start": "2025-09-03",
        "end": "2025-11-08",
        "priority": 5
    },
    {
        "id": "6",
        "name": "KURINA DAULATPUR",
        "status": "O&M Started",
        "start": "2025-10-10",
        "end": "2025-12-04",
        "priority": 6
    },
    {
        "id": "7",
        "name": "JAMLAPUR",
        "status": "O&M Started",
        "start": "2025-10-10",
        "end": "2025-12-06",
        "priority": 7
    },
    {
        "id": "8",
        "name": "BUDHARRA",
        "status": "O&M Started",
        "start": "2025-10-07",
        "end": "2025-12-04",
        "priority": 8
    },
    {
        "id": "9",
        "name": "SARAI AHMAD KHAN",
        "status": "O&M Started",
        "start": "2025-10-07",
        "end": "2025-12-07",
        "priority": 9
    },
    {
        "id": "10",
        "name": "KHERIYA TAJ",
        "status": "O&M Started",
        "start": "2025-10-09",
        "end": "2025-12-08",
        "priority": 10
    },
    {
        "id": "11",
        "name": "MALIGAWAN",
        "status": "O&M Started",
        "start": "2025-11-18",
        "end": "2026-01-08",
        "priority": 11
    },
    {
        "id": "12",
        "name": "BARAULI",
        "status": "O&M Started",
        "start": "2025-11-17",
        "end": "2026-01-09",
        "priority": 12
    },
    {
        "id": "13",
        "name": "PAHRAIYA",
        "status": "O&M Started",
        "start": "2025-11-16",
        "end": "2026-01-13",
        "priority": 13
    },
    {
        "id": "14",
        "name": "CHILASNI",
        "status": "O&M Started",
        "start": "2025-11-18",
        "end": "2026-02-13",
        "priority": 14
    },
    {
        "id": "15",
        "name": "UMMARPUR RIJOR",
        "status": "O&M Started",
        "start": "2025-11-18",
        "end": "2026-02-11",
        "priority": 15
    },
    {
        "id": "16",
        "name": "CHURTHARA",
        "status": "O&M Started",
        "start": "2025-12-12",
        "end": "2026-02-09",
        "priority": 16
    },
    {
        "id": "17",
        "name": "KHANPUR",
        "status": "O&M Started",
        "start": "2025-12-17",
        "end": "2026-02-10",
        "priority": 17
    },
    {
        "id": "18",
        "name": "GANGUPURA",
        "status": "O&M Started",
        "start": "2025-12-14",
        "end": "2026-02-07",
        "priority": 18
    },
    {
        "id": "19",
        "name": "BABARPUR",
        "status": "WIP",
        "start": "2025-12-18",
        "end": "2026-03-02",
        "priority": 19
    },
    {
        "id": "20",
        "name": "HIMMATPUR",
        "status": "WIP",
        "start": "2025-12-15",
        "end": "2026-03-05",
        "priority": 20
    },
    {
        "id": "21",
        "name": "BHIAU",
        "status": "WIP",
        "start": "2025-12-28",
        "end": "2026-03-07",
        "priority": 21
    },
    {
        "id": "22",
        "name": "MANIKPUR",
        "status": "WIP",
        "start": "2025-12-25",
        "end": "2026-03-06",
        "priority": 22
    },
    {
        "id": "23",
        "name": "PURAW",
        "status": "WIP",
        "start": "2025-12-26",
        "end": "2026-03-06",
        "priority": 23
    },
    {
        "id": "24",
        "name": "RAMPUR GHANSHYAM",
        "status": "WIP",
        "start": "2026-02-06",
        "end": "2026-03-29",
        "priority": 24
    },
    {
        "id": "25",
        "name": "MISHRI",
        "status": "WIP",
        "start": "2026-02-03",
        "end": "2026-03-29",
        "priority": 25
    },
    {
        "id": "26",
        "name": "BHADAIRA",
        "status": "WIP",
        "start": "2026-02-07",
        "end": "2026-03-28",
        "priority": 26
    },
    {
        "id": "27",
        "name": "MISAKHURD",
        "status": "WIP",
        "start": "2026-02-07",
        "end": "2026-03-27",
        "priority": 27
    },
    {
        "id": "28",
        "name": "DADUPUR KHURD",
        "status": "WIP",
        "start": "2026-02-02",
        "end": "2026-03-27",
        "priority": 28
    },
    {
        "id": "29",
        "name": "SARNAU",
        "status": "WIP",
        "start": "2026-02-04",
        "end": "2026-03-31",
        "priority": 29
    },
    {
        "id": "30",
        "name": "KARHALA KASIMPUR",
        "status": "WIP",
        "start": "2026-02-08",
        "end": "2026-03-28",
        "priority": 30
    }
];
