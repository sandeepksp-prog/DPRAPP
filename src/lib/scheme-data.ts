// Auto-generated scheme data from SCHEME DETAILS.xlsx

export interface SchemeInfo {
    id: number;
    name: string;
}

export interface SchemeDetailedInfo extends SchemeInfo {
    block: string;
}

// List of all unique blocks
export const BLOCKS: string[] = [
    "ALIGANJ",
    "JAITHRA",
    "SAKIT",
    "AWAGARH",
    "JALESAR",
    "NIDHAULI KALAN",
    "MAREHRA",
    "MARHERA",
    "SHITALPUR"
];

// Mapping of Block -> Array of Schemes
export const BLOCK_SCHEMES: Record<string, SchemeInfo[]> = {
    "ALIGANJ": [
        {
            "id": 20070355,
            "name": "DADUPUR KHURD"
        },
        {
            "id": 20079592,
            "name": "PAHRAIYA"
        }
    ],
    "JAITHRA": [
        {
            "id": 20086127,
            "name": "NAGLA DAYAL"
        },
        {
            "id": 20086871,
            "name": "JAMLAPUR"
        },
        {
            "id": 20086873,
            "name": "GANGUPURA"
        }
    ],
    "SAKIT": [
        {
            "id": 20070384,
            "name": "KURINA DAULATPUR"
        },
        {
            "id": 20086104,
            "name": "MANIKPUR"
        },
        {
            "id": 20094705,
            "name": "NAGLA HAMIR"
        },
        {
            "id": 20086137,
            "name": "MISHRI"
        },
        {
            "id": 20086152,
            "name": "UMMARPUR RIJOR"
        },
        {
            "id": 20086150,
            "name": "CHILASNI"
        },
        {
            "id": 20086864,
            "name": "PURAW"
        },
        {
            "id": 20086867,
            "name": "MALIGAWAN"
        }
    ],
    "AWAGARH": [
        {
            "id": 20086842,
            "name": "KHERIYA TAJ"
        },
        {
            "id": 20086120,
            "name": "NARHULI"
        },
        {
            "id": 20086093,
            "name": "BABARPUR"
        },
        {
            "id": 20086089,
            "name": "BIRNAGAR"
        },
        {
            "id": 20086840,
            "name": "MISAKHURD"
        },
        {
            "id": 20086845,
            "name": "CHURTHARA"
        }
    ],
    "JALESAR": [
        {
            "id": 20086131,
            "name": "KARHALA KASIMPUR"
        },
        {
            "id": 20094701,
            "name": "BHIAU"
        },
        {
            "id": 20070360,
            "name": "KHANPUR"
        }
    ],
    "NIDHAULI KALAN": [
        {
            "id": 20086097,
            "name": "BARAGAON"
        },
        {
            "id": 20086096,
            "name": "BANTHAL QUTUBPUR"
        },
        {
            "id": 20086098,
            "name": "SUNNA SIHORI"
        },
        {
            "id": 20086853,
            "name": "MUMIYA KHERA"
        },
        {
            "id": 20086855,
            "name": "PALIA"
        },
        {
            "id": 20086890,
            "name": "HIMMATPUR"
        }
    ],
    "MAREHRA": [
        {
            "id": 20086835,
            "name": "BUDHARRA"
        },
        {
            "id": 20086849,
            "name": "SARAI AHMAD KHAN"
        },
        {
            "id": 20086882,
            "name": "SAMASPUR"
        },
        {
            "id": 20094707,
            "name": "SUPAITI"
        }
    ],
    "MARHERA": [
        {
            "id": 20070351,
            "name": "SARNAU"
        }
    ],
    "SHITALPUR": [
        {
            "id": 20075838,
            "name": "NAGALA FARID"
        },
        {
            "id": 20086107,
            "name": "SONSA"
        },
        {
            "id": 20086883,
            "name": "RAMPUR GHANSHYAM"
        },
        {
            "id": 20060951,
            "name": "BARAULI"
        },
        {
            "id": 20086861,
            "name": "VIRAMPUR ETAH"
        },
        {
            "id": 20075830,
            "name": "GARHI TALLUKA BARAULI"
        }
    ]
};

// Fast lookup Map for O(1) scheme details by ID
export const SCHEME_MAP: Record<string, { name: string; block: string }> = {
    "20070355": {
        "name": "DADUPUR KHURD",
        "block": "ALIGANJ"
    },
    "20079592": {
        "name": "PAHRAIYA",
        "block": "ALIGANJ"
    },
    "20086127": {
        "name": "NAGLA DAYAL",
        "block": "JAITHRA"
    },
    "20086871": {
        "name": "JAMLAPUR",
        "block": "JAITHRA"
    },
    "20086873": {
        "name": "GANGUPURA",
        "block": "JAITHRA"
    },
    "20070384": {
        "name": "KURINA DAULATPUR",
        "block": "SAKIT"
    },
    "20086104": {
        "name": "MANIKPUR",
        "block": "SAKIT"
    },
    "20094705": {
        "name": "NAGLA HAMIR",
        "block": "SAKIT"
    },
    "20086137": {
        "name": "MISHRI",
        "block": "SAKIT"
    },
    "20086152": {
        "name": "UMMARPUR RIJOR",
        "block": "SAKIT"
    },
    "20086150": {
        "name": "CHILASNI",
        "block": "SAKIT"
    },
    "20086864": {
        "name": "PURAW",
        "block": "SAKIT"
    },
    "20086867": {
        "name": "MALIGAWAN",
        "block": "SAKIT"
    },
    "20086842": {
        "name": "KHERIYA TAJ",
        "block": "AWAGARH"
    },
    "20086120": {
        "name": "NARHULI",
        "block": "AWAGARH"
    },
    "20086093": {
        "name": "BABARPUR",
        "block": "AWAGARH"
    },
    "20086089": {
        "name": "BIRNAGAR",
        "block": "AWAGARH"
    },
    "20086840": {
        "name": "MISAKHURD",
        "block": "AWAGARH"
    },
    "20086845": {
        "name": "CHURTHARA",
        "block": "AWAGARH"
    },
    "20086131": {
        "name": "KARHALA KASIMPUR",
        "block": "JALESAR"
    },
    "20094701": {
        "name": "BHIAU",
        "block": "JALESAR"
    },
    "20070360": {
        "name": "KHANPUR",
        "block": "JALESAR"
    },
    "20086097": {
        "name": "BARAGAON",
        "block": "NIDHAULI KALAN"
    },
    "20086096": {
        "name": "BANTHAL QUTUBPUR",
        "block": "NIDHAULI KALAN"
    },
    "20086098": {
        "name": "SUNNA SIHORI",
        "block": "NIDHAULI KALAN"
    },
    "20086853": {
        "name": "MUMIYA KHERA",
        "block": "NIDHAULI KALAN"
    },
    "20086855": {
        "name": "PALIA",
        "block": "NIDHAULI KALAN"
    },
    "20086890": {
        "name": "HIMMATPUR",
        "block": "NIDHAULI KALAN"
    },
    "20086835": {
        "name": "BUDHARRA",
        "block": "MAREHRA"
    },
    "20086849": {
        "name": "SARAI AHMAD KHAN",
        "block": "MAREHRA"
    },
    "20086882": {
        "name": "SAMASPUR",
        "block": "MAREHRA"
    },
    "20094707": {
        "name": "SUPAITI",
        "block": "MAREHRA"
    },
    "20070351": {
        "name": "SARNAU",
        "block": "MARHERA"
    },
    "20075838": {
        "name": "NAGALA FARID",
        "block": "SHITALPUR"
    },
    "20086107": {
        "name": "SONSA",
        "block": "SHITALPUR"
    },
    "20086883": {
        "name": "RAMPUR GHANSHYAM",
        "block": "SHITALPUR"
    },
    "20060951": {
        "name": "BARAULI",
        "block": "SHITALPUR"
    },
    "20086861": {
        "name": "VIRAMPUR ETAH",
        "block": "SHITALPUR"
    },
    "20075830": {
        "name": "GARHI TALLUKA BARAULI",
        "block": "SHITALPUR"
    }
};
