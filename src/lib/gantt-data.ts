export interface GanttScheme {
    id: string;
    name: string;
    status: 'Completed' | 'WIP' | 'Planned';
    start: string;
    end: string;
    priority: number;
}

export const GANTT_PRIORITY_SCHEMES: GanttScheme[] = [
    {
        "id": "1",
        "name": "VIRAMPUR ETAH",
        "status": "Completed",
        "start": "2026-01-30",
        "end": "2026-02-17",
        "priority": 1
    },
    {
        "id": "2",
        "name": "NAGALA FARID",
        "status": "Completed",
        "start": "2025-12-07",
        "end": "2026-01-15",
        "priority": 2
    },
    {
        "id": "3",
        "name": "SUPAITI",
        "status": "Completed",
        "start": "2026-01-23",
        "end": "2026-02-09",
        "priority": 3
    },
    {
        "id": "4",
        "name": "MUMIYA KHERA",
        "status": "Completed",
        "start": "2026-01-09",
        "end": "2026-01-21",
        "priority": 4
    },
    {
        "id": "5",
        "name": "PALIA",
        "status": "Completed",
        "start": "2026-01-25",
        "end": "2026-02-06",
        "priority": 5
    },
    {
        "id": "6",
        "name": "KURINA DAULATPUR",
        "status": "Completed",
        "start": "2025-11-14",
        "end": "2025-12-02",
        "priority": 6
    },
    {
        "id": "7",
        "name": "JAMLAPUR",
        "status": "Completed",
        "start": "2025-12-29",
        "end": "2026-01-22",
        "priority": 7
    },
    {
        "id": "8",
        "name": "BUDHARRA",
        "status": "Completed",
        "start": "2025-12-10",
        "end": "2025-12-27",
        "priority": 8
    },
    {
        "id": "9",
        "name": "SARAI AHMAD KHAN",
        "status": "Completed",
        "start": "2025-11-15",
        "end": "2025-12-11",
        "priority": 9
    },
    {
        "id": "10",
        "name": "KHERIYA TAJ",
        "status": "Completed",
        "start": "2026-01-30",
        "end": "2026-02-09",
        "priority": 10
    },
    {
        "id": "11",
        "name": "MALIGAWAN",
        "status": "Completed",
        "start": "2025-12-30",
        "end": "2026-02-08",
        "priority": 11
    },
    {
        "id": "12",
        "name": "BARAULI",
        "status": "Completed",
        "start": "2026-02-08",
        "end": "2026-02-28",
        "priority": 12
    },
    {
        "id": "13",
        "name": "PAHRAIYA",
        "status": "Completed",
        "start": "2026-01-31",
        "end": "2026-02-20",
        "priority": 13
    },
    {
        "id": "14",
        "name": "CHILASNI",
        "status": "Completed",
        "start": "2025-12-07",
        "end": "2026-01-08",
        "priority": 14
    },
    {
        "id": "15",
        "name": "UMMARPUR RIJOR",
        "status": "Completed",
        "start": "2025-12-26",
        "end": "2026-01-26",
        "priority": 15
    },
    {
        "id": "16",
        "name": "CHURTHARA",
        "status": "Completed",
        "start": "2025-11-26",
        "end": "2025-12-27",
        "priority": 16
    },
    {
        "id": "17",
        "name": "KHANPUR",
        "status": "Completed",
        "start": "2025-11-02",
        "end": "2025-11-13",
        "priority": 17
    },
    {
        "id": "18",
        "name": "GANGUPURA",
        "status": "WIP",
        "start": "2026-02-07",
        "end": "2026-02-28",
        "priority": 18
    },
    {
        "id": "19",
        "name": "BABARPUR",
        "status": "WIP",
        "start": "2025-11-18",
        "end": "2025-12-25",
        "priority": 19
    },
    {
        "id": "20",
        "name": "HIMMATPUR",
        "status": "WIP",
        "start": "2025-11-05",
        "end": "2025-12-09",
        "priority": 20
    },
    {
        "id": "21",
        "name": "BHIAU",
        "status": "WIP",
        "start": "2025-11-27",
        "end": "2026-01-06",
        "priority": 21
    },
    {
        "id": "22",
        "name": "MANIKPUR",
        "status": "WIP",
        "start": "2026-02-03",
        "end": "2026-02-28",
        "priority": 22
    },
    {
        "id": "23",
        "name": "PURAW",
        "status": "WIP",
        "start": "2026-01-09",
        "end": "2026-01-23",
        "priority": 23
    },
    {
        "id": "24",
        "name": "RAMPUR GHANSHYAM",
        "status": "WIP",
        "start": "2026-01-17",
        "end": "2026-02-11",
        "priority": 24
    },
    {
        "id": "25",
        "name": "MISHRI",
        "status": "WIP",
        "start": "2026-01-05",
        "end": "2026-02-13",
        "priority": 25
    },
    {
        "id": "26",
        "name": "BHADAIRA",
        "status": "WIP",
        "start": "2026-01-20",
        "end": "2026-02-28",
        "priority": 26
    },
    {
        "id": "27",
        "name": "MISAKHURD",
        "status": "WIP",
        "start": "2026-01-20",
        "end": "2026-02-12",
        "priority": 27
    },
    {
        "id": "28",
        "name": "DADUPUR KHURD",
        "status": "WIP",
        "start": "2026-02-02",
        "end": "2026-02-28",
        "priority": 28
    },
    {
        "id": "29",
        "name": "SARNAU",
        "status": "WIP",
        "start": "2026-02-04",
        "end": "2026-02-28",
        "priority": 29
    },
    {
        "id": "30",
        "name": "KARHALA KASIMPUR",
        "status": "WIP",
        "start": "2026-01-11",
        "end": "2026-01-29",
        "priority": 30
    }
];
