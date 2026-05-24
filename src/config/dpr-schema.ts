export interface Rule {
  field: string;
  operator: 'equals' | 'contains' | 'in';
  value: any;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'dropdown' | 'radio' | 'multicheck' | 'grid' | 'file' | 'gps' | 'camera';
  options?: string[];
  required?: boolean;
  placeholder?: string;
  showIf?: Rule[];
}

export interface FormSection {
  id: string;
  title: string;
  icon: string;
  showIf?: Rule[];
  fields: FormField[];
}

export const DPR_FORM_SCHEMA: FormSection[] = [
  {
    id: 'header',
    title: 'Daily Project Report (Header)',
    icon: 'DocumentTextIcon',
    fields: [
      { id: 'date', label: 'Report Date', type: 'date', required: true },
      { id: 'block', label: 'Block Name', type: 'dropdown', required: true },
      { id: 'scheme', label: 'Scheme Name', type: 'dropdown', required: true },
      { id: 'gps', label: 'Capture GPS Coordinates', type: 'gps', required: true },
      { id: 'reporter', label: 'Reported By (Engineer Name)', type: 'text', required: true }
    ]
  },
  {
    id: 'segregation',
    title: 'Segregation',
    icon: 'ArrowsRightLeftIcon',
    fields: [
      { 
        id: 'updateType', 
        label: 'Type of Update', 
        type: 'radio', 
        options: ['Work Progress Update', 'TPI Inspection Update'], 
        required: true 
      }
    ]
  },
  {
    id: 'discipline',
    title: 'Discipline',
    icon: 'AcademicCapIcon',
    showIf: [{ field: 'updateType', operator: 'equals', value: 'Work Progress Update' }],
    fields: [
      {
        id: 'disciplineType',
        label: 'Discipline of Work',
        type: 'radio',
        options: ['CIVIL', 'E&M (Electrical & Mechanical)', 'PIPE LINE'],
        required: true
      }
    ]
  },
  {
    id: 'civil_selection',
    title: 'Civil Work Sub-Structures',
    icon: 'BuildingOfficeIcon',
    showIf: [
      { field: 'updateType', operator: 'equals', value: 'Work Progress Update' },
      { field: 'disciplineType', operator: 'equals', value: 'CIVIL' }
    ],
    fields: [
      {
        id: 'civilWorkType',
        label: 'Type of Civil Work',
        type: 'multicheck',
        options: ['OHT', 'PUMP HOUSE', 'BOUNDARY WALL', 'DI WORK', 'CAMPUS ITEMS'],
        required: true
      }
    ]
  },
  {
    id: 'oht_details',
    title: 'OHT Work Progress',
    icon: 'CloudIcon',
    showIf: [
      { field: 'updateType', operator: 'equals', value: 'Work Progress Update' },
      { field: 'disciplineType', operator: 'equals', value: 'CIVIL' },
      { field: 'civilWorkType', operator: 'contains', value: 'OHT' }
    ],
    fields: [
      { id: 'ohtType', label: 'Type of OHT', type: 'radio', options: ['ZINC ALUM', 'CONVENTIONAL'], required: true },
      { 
        id: 'zincAlumStage', 
        label: 'Zinc Alum Stage of Work', 
        type: 'dropdown', 
        options: [
          'Excavation', 'PCC', 'RCC foundation', 'Pedestal/Staging', 
          'Ring Beam', 'Sheet erection', 'Testing', 'Completed'
        ],
        showIf: [{ field: 'ohtType', operator: 'equals', value: 'ZINC ALUM' }]
      },
      {
        id: 'conventionalStage',
        label: 'Conventional Stage of Work',
        type: 'dropdown',
        options: [
          'Excavation', 'PCC', 'Raft RCC', 'GL (Ground Level)', 
          'Ground Brace Beam', 'Columns (CBR)', 'Brace Beam 1 (PB1)', 
          'Brace Beam 2 (PB2)', 'Staircase', 'Bottom Dome (BD)', 
          'Cylindrical Wall', 'Ring Beam', 'Top Dome (TD)', 'Completed'
        ],
        showIf: [{ field: 'ohtType', operator: 'equals', value: 'CONVENTIONAL' }]
      },
      {
        id: 'conventionalGlFields',
        label: 'GL (Ground Level) Work Details',
        type: 'multicheck',
        options: ['Column Reinforcement', 'Column Casting'],
        showIf: [{ field: 'conventionalStage', operator: 'equals', value: 'GL (Ground Level)' }]
      },
      {
        id: 'conventionalBraceFields',
        label: 'Ground Brace Beam Details',
        type: 'multicheck',
        options: ['Shuttering', 'Reinforcement', 'Casting'],
        showIf: [{ field: 'conventionalStage', operator: 'equals', value: 'Ground Brace Beam' }]
      }
    ]
  },
  {
    id: 'pump_house_details',
    title: 'Pump House Details',
    icon: 'HomeIcon',
    showIf: [
      { field: 'updateType', operator: 'equals', value: 'Work Progress Update' },
      { field: 'disciplineType', operator: 'equals', value: 'CIVIL' },
      { field: 'civilWorkType', operator: 'contains', value: 'PUMP HOUSE' }
    ],
    fields: [
      { 
        id: 'pumpHouseStage', 
        label: 'Stage of Work - PUMP HOUSE', 
        type: 'dropdown', 
        options: ['Excavation', 'PCC', 'Raft/Foundation', 'Plinth Beam', 'Brick Work', 'Lintel Beam & Sunshade', 'Roof Slab', 'Plastering', 'Painting'], 
        required: true 
      }
    ]
  },
  {
    id: 'pipeline_details',
    title: 'Pipeline Work Details',
    icon: 'GlobeAsiaAustraliaIcon',
    showIf: [
      { field: 'updateType', operator: 'equals', value: 'Work Progress Update' },
      { field: 'disciplineType', operator: 'equals', value: 'PIPE LINE' }
    ],
    fields: [
      {
        id: 'pipelineTask',
        label: 'Type of Pipeline Work',
        type: 'multicheck',
        options: ['Laying', 'Restoration', 'Hydrotesting', 'FHTC', 'Grouting'],
        required: true
      },
      {
        id: 'pipelineLayingRoad',
        label: 'Type of Road (Laying)',
        type: 'multicheck',
        options: ['BOE Road', 'CC Road', 'INTERLOCKING', 'BT ROAD', 'KACHA Road'],
        showIf: [{ field: 'pipelineTask', operator: 'contains', value: 'Laying' }]
      },
      {
        id: 'pipelineLayingNodes',
        label: 'Today\'s Laying work (Node → Node)',
        type: 'text',
        placeholder: 'e.g. N12 -> N15',
        showIf: [{ field: 'pipelineTask', operator: 'contains', value: 'Laying' }]
      },
      {
        id: 'pipelineFhtcNodes',
        label: 'Today\'s FHTC work (Node → Node)',
        type: 'text',
        placeholder: 'e.g. N12 -> N15',
        showIf: [{ field: 'pipelineTask', operator: 'contains', value: 'FHTC' }]
      },
      {
        id: 'pipelineFhtcCount',
        label: 'Today\'s FHTC Connection Count',
        type: 'number',
        placeholder: 'e.g. 5',
        showIf: [{ field: 'pipelineTask', operator: 'contains', value: 'FHTC' }]
      }
    ]
  },
  {
    id: 'em_details',
    title: 'E&M Work Details',
    icon: 'BoltIcon',
    showIf: [
      { field: 'updateType', operator: 'equals', value: 'Work Progress Update' },
      { field: 'disciplineType', operator: 'equals', value: 'E&M (Electrical & Mechanical)' }
    ],
    fields: [
      {
        id: 'emTask',
        label: 'Specific Task (E&M)',
        type: 'multicheck',
        options: ['Borewell works', 'Solar works', 'Internal Items', 'Chlorine Dosing System', 'Turbidity Analyzer'],
        required: true
      }
    ]
  },
  {
    id: 'tpi_details',
    title: 'TPI Inspection Progress',
    icon: 'ShieldCheckIcon',
    showIf: [{ field: 'updateType', operator: 'equals', value: 'TPI Inspection Update' }],
    fields: [
      {
        id: 'tpiWorkVisited',
        label: 'Civil Work TPI Visited',
        type: 'multicheck',
        options: ['OHT', 'PUMP HOUSE', 'CAMPUS ITEMS'],
        required: true
      },
      {
        id: 'tpiOhtDetails',
        label: 'TPI Inspected Stages (OHT)',
        type: 'dropdown',
        options: ['Raft Reinforcement', 'Column Casting', 'Brace Beam Casting', 'Dome Shuttering', 'Hydrotesting Inspection'],
        showIf: [{ field: 'tpiWorkVisited', operator: 'contains', value: 'OHT' }]
      }
    ]
  },
  {
    id: 'contractor_labor',
    title: 'Contractor & Labor Details',
    icon: 'UserGroupIcon',
    fields: [
      { id: 'contractorName', label: 'Site Contractor Name', type: 'dropdown', required: true },
      { id: 'civilManpower', label: 'Civil Manpower Count', type: 'grid', required: true },
      { id: 'emManpower', label: 'E&M Manpower Count', type: 'grid', required: true }
    ]
  },
  {
    id: 'issue_report',
    title: 'Issue Reporting',
    icon: 'ExclamationTriangleIcon',
    fields: [
      { 
        id: 'issueType', 
        label: 'Type of Active Issue', 
        type: 'radio', 
        options: ['No Issue', 'Material/Machinery Related', 'Local People Related'], 
        required: true 
      },
      { 
        id: 'issueDescription', 
        label: 'Describe the Issue in Detail', 
        type: 'text', 
        required: true,
        showIf: [{ field: 'issueType', operator: 'in', value: ['Material/Machinery Related', 'Local People Related'] }]
      },
      { id: 'sitePhotos', label: 'Upload Site Images (Max 5)', type: 'file', required: false }
    ]
  }
];
