export type FieldType = 'Dropdown' | 'MultipleChoice' | 'MultiSelect' | 'ShortAnswer' | 'Image' | 'FileUpload' | 'DatePicker' | 'LocationCoordinates' | 'Table' | 'NodeEntry' | 'Number';

export interface FormField {
  id: string;
  question: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  required?: boolean;
  showIf?: {
    fieldId: string;
    equals?: string;
    in?: string[];
    includes?: string;
    includesAny?: string[];
    isNotEmpty?: boolean;
    or?: { fieldId: string; equals: string }[];
  };
}

export const TPI_SCHEMA: FormField[] = [
  { id: "tpi_discipline", question: "Discipline", type: "MultipleChoice", options: ["CIVIL", "E&M", "PIPELINE"] },
  
  // CIVIL LOGIC
  { id: "tpi_civil_works", question: "Specify the Civil Works that TPI visited?", type: "Dropdown", options: ["OHT", "PUMP HOUSE", "CAMPUS ITEMS"], showIf: { fieldId: "tpi_discipline", includes: "CIVIL" } },
  { id: "tpi_civil_oht", question: "Describe the work TPI inspected for? (OHT)", type: "MultiSelect", options: ["Rafting work", "Ground Beam", "Half Staging", "Full Staging", "Stair Case Completion", "Slab Work", "Cube Testing (LAB)", "Railing work", "DI Fittings (OHT)", "Normal Checking"], showIf: { fieldId: "tpi_civil_works", equals: "OHT" } },
  { id: "tpi_civil_ph", question: "Describe the work TPI inspected for? (P/H)", type: "MultiSelect", options: ["Below GL Checking", "Lintel Beam Checking", "Slab Checking", "Plastering Checking", "Cube Testing (LAB)"], showIf: { fieldId: "tpi_civil_works", equals: "PUMP HOUSE" } },
  { id: "tpi_civil_ci", question: "Describe the work TPI inspected for? (CI)", type: "MultiSelect", options: ["Chambers Checking", "Approach Road Checking", "DG Foundation Checking"], showIf: { fieldId: "tpi_civil_works", equals: "CAMPUS ITEMS" } },
  
  // PIPELINE LOGIC
  { id: "tpi_pipeline", question: "Describe the work TPI inspected for? (PIPELINE)", type: "MultiSelect", options: ["Trench Checking", "Laying Checking", "Hydrotest Checking", "Restoration Checking", "CC Road Cube Testing (LAB)"], showIf: { fieldId: "tpi_discipline", includes: "PIPELINE" } },
  
  // E&M LOGIC
  { id: "tpi_em", question: "Describe the work TPI inspected for? (E&M)", type: "MultiSelect", options: ["Solar Installation Visit", "Instrumentation Visit", "Pump Lowering Visit"], showIf: { fieldId: "tpi_discipline", includes: "E&M" } }
];

export const DISCIPLINE_SCHEMAS: Record<string, FormField[]> = {
  "E&M": [
    { id: "em_type", question: "Type of Work?", type: "Dropdown", options: ["Solar Works", "Borewell works", "Pump lowering", "Integration Items"] },
    { id: "em_borewell", question: "Mention the specific task - In Borewell works", type: "MultipleChoice", options: ["Bhogi", "Compressor", "OP"], showIf: { fieldId: "em_type", equals: "Borewell works" } },
    { id: "em_solar", question: "Mention the specific task - In Solar works", type: "MultipleChoice", options: ["Column Foundations", "Structure Erection", "Module Installation", "Wiring & Earthing Works", "Integration & SCADA"], showIf: { fieldId: "em_type", equals: "Solar Works" } },
    { id: "em_integration", question: "Mention the specific task - In Integration Items", type: "MultipleChoice", options: ["Sluice Valves fittings", "Pump house Electrical work", "EMF installation", "ALL sensors erection"], showIf: { fieldId: "em_type", equals: "Integration Items" } }
  ],
  
  "PIPELINE": [
    { id: "pl_type", question: "Type of Work", type: "MultiSelect", options: ["Hydrotesting", "Pipe Laying", "Dismantling/Trenching", "Restoration/Reinstatement", "Pipe Jointing", "NEW FHTC", "FHTC Repair", "FHTC GROUTING WORKS", "Valves & Fittings", "AADHAR CARD COLLECTION", "FHTC PAINTING WORK", "DI Pipe Works", "Others"] },
    
    // Pipe Nodes Logic
    { id: "pl_road", question: "Type of Road?", type: "MultipleChoice", options: ["BOE ROAD", "CC ROAD", "INTERLOCK ROAD", "BT ROAD", "KACHA ROAD"], showIf: { fieldId: "pl_type", includesAny: ["Pipe Laying", "Dismantling/Trenching", "Restoration/Reinstatement", "Pipe Jointing", "NEW FHTC", "FHTC Repair"] } },
    { id: "pl_valves", question: "Type of Valve fitting (specific)?", type: "MultipleChoice", options: ["Sluice Valve", "Scour Valve", "Air Valve", "Fire Hydrant Valve"], showIf: { fieldId: "pl_type", includes: "Valves & Fittings" } },
    
    { id: "pl_laying_nodes", question: "Today's laying work has been done from (Node -> Node), mention the junction numbers.", type: "NodeEntry", showIf: { fieldId: "pl_type", includes: "Pipe Laying" } },
    { id: "pl_resto_nodes", question: "Today's Restoration work has been done from (Node -> Node), mention the junction numbers.", type: "NodeEntry", showIf: { fieldId: "pl_type", includes: "Restoration/Reinstatement" } },
    { id: "pl_hydro_nodes", question: "Today's hydrotesting work has been done from (Node -> Node), mention the junction numbers.", type: "NodeEntry", showIf: { fieldId: "pl_type", includes: "Hydrotesting" } },
    { id: "pl_newfhtc_nodes", question: "Today's NEW FHTC work has been done from (Node -> Node), mention the Junction numbers.", type: "NodeEntry", showIf: { fieldId: "pl_type", includes: "NEW FHTC" } },
    { id: "pl_repfhtc_nodes", question: "Today's Repair FHTC work has been done from (Node -> Node), mention the Junction numbers.", type: "NodeEntry", showIf: { fieldId: "pl_type", includes: "FHTC Repair" } },
    
    { id: "pl_grouting_fhtc", question: "Today's Grouting work has been done for (FHTC), mention the FHTC numbers.", type: "ShortAnswer", showIf: { fieldId: "pl_type", includes: "FHTC GROUTING WORKS" } },
    { id: "pl_painting_fhtc", question: "Today's Painting work has been done for (FHTC), mention the FHTC numbers & count.", type: "ShortAnswer", showIf: { fieldId: "pl_type", includes: "FHTC PAINTING WORK" } },
    { id: "pl_aadhar", question: "Mention AADHAR Number and FHTC Number Collected.", type: "ShortAnswer", showIf: { fieldId: "pl_type", includes: "AADHAR CARD COLLECTION" } },
    { id: "pl_others", question: "Specify the work", type: "MultipleChoice", options: ["Colvert Crossing", "SH Crossing", "NH Crossing", "Railway Track Crossing"], showIf: { fieldId: "pl_type", includes: "Others" } },
    
    // CROSS-LINKED DI WORK
    { id: "pl_di_work", question: "TYPE OF WORK - DI WORK", type: "MultiSelect", options: ["Dismantling/Excavation work", "DI/DF vertical pipe Erection", "DI Rising Main", "Thrust Block Work"], showIf: { fieldId: "pl_type", includes: "DI Pipe Works" } }
  ],
  
  "CIVIL": [
    // MASTER CIVIL SELECTION
    { id: "civil_type", question: "Type of Civil Work", type: "Dropdown", options: ["OHT Construction", "Pump House Construction", "Boundary Wall Construction", "DI Pipe Works", "Campus Items"] },
    
    // --- OHT BLOCK ---
    { id: "oht_type", question: "Type of OHT", type: "Dropdown", options: ["Conventional Tank", "Zinc-Alum Tank"], showIf: { fieldId: "civil_type", equals: "OHT Construction" } },
    
    { id: "oht_zinc_stage", question: "ZINC ALUM OHT - Stage of Work?", type: "Dropdown", options: ["GL (GROUND LEVEL)", "GROUND BRACE BEAM", "BRACE BEAMS", "SLAB WORK", "STAIR CASE WORK", "PB1 REINFORCEMENT", "PB2 REINFORCEMENT", "ZINC AL TANK INSTALLATION", "OTHERS"], showIf: { fieldId: "oht_type", equals: "Zinc-Alum Tank" } },
    { id: "oht_conv_stage", question: "CONVENTIONAL OHT - Stage of Work?", type: "Dropdown", options: ["GL (GROUND LEVEL)", "GROUND BRACE BEAM", "BRACE BEAMS", "CIRCULAR RING BEAM", "BOTTOM DOME WORK", "WALK WAY BUILDING", "SIDE WALLS", "TOP DOME WORK", "STAIR CASE WORK", "PB1 Work", "PB2 Work", "OTHERS"], showIf: { fieldId: "oht_type", equals: "Conventional Tank" } },
    
    { id: "oht_others", question: "If 'Other,' please specify?", type: "MultipleChoice", options: ["Railing works", "Painting works", "Flooring work", "Plinth Protection", "Small patch works", "Water Curing"], showIf: { fieldId: "oht_conv_stage", equals: "OTHERS" } },
    
    { id: "oht_gl_stage", question: "GL - GROUND LEVEL", type: "Dropdown", options: ["Column Reinforcement", "Column Casting"], showIf: { or: [{ fieldId: "oht_conv_stage", equals: "GL (GROUND LEVEL)" }, { fieldId: "oht_zinc_stage", equals: "GL (GROUND LEVEL)" }] } },
    { id: "oht_gbb_stage", question: "GROUND BRACE BEAM", type: "Dropdown", options: ["Shuttering", "Reinforcement", "Casting"], showIf: { or: [{ fieldId: "oht_conv_stage", equals: "GROUND BRACE BEAM" }, { fieldId: "oht_zinc_stage", equals: "GROUND BRACE BEAM" }] } },
    { id: "oht_brace_num", question: "Specify the Brace Beam number?", type: "Dropdown", options: ["BR1", "BR2", "BR3", "BR4", "BR5", "BR6"], showIf: { or: [{ fieldId: "oht_conv_stage", equals: "BRACE BEAMS" }, { fieldId: "oht_zinc_stage", equals: "BRACE BEAMS" }] } },
    { id: "oht_brace_stage", question: "Describe the stage of work?", type: "Dropdown", options: ["Column Shuttering work upto BR", "Column Reinforcement upto BR", "Column casting upto BR", "Brace beam Shuttering work", "Brace beam reinforcement", "Brace beam casting work"], showIf: { or: [{ fieldId: "oht_conv_stage", equals: "BRACE BEAMS" }, { fieldId: "oht_zinc_stage", equals: "BRACE BEAMS" }] } },
    
    { id: "oht_crb_stage", question: "Describe the stage of work (CRB)?", type: "Dropdown", options: ["Shuttering work", "Column reinforcement upto CRB", "Column Casting work"], showIf: { fieldId: "oht_conv_stage", equals: "CIRCULAR RING BEAM" } },
    
    { id: "oht_stair_num", question: "Stair case flight number?", type: "Dropdown", options: ["1ST FLIGHT", "2ND FLIGHT", "3RD FLIGHT", "4TH FLIGHT"], showIf: { or: [{ fieldId: "oht_conv_stage", equals: "STAIR CASE WORK" }, { fieldId: "oht_zinc_stage", equals: "STAIR CASE WORK" }] } },
    { id: "oht_stair_stage", question: "Specify the work?", type: "Dropdown", options: ["Shuttering & Reinforcement Work for Waist Slab", "Casting work for Waist Slab", "Reinforcement work for Stair Case", "Casting Work for Stair Case"], showIf: { or: [{ fieldId: "oht_conv_stage", equals: "STAIR CASE WORK" }, { fieldId: "oht_zinc_stage", equals: "STAIR CASE WORK" }] } },

    // --- PUMP HOUSE BLOCK ---
    { id: "ph_stage", question: "Stage of work - PUMP HOUSE?", type: "Dropdown", options: ["EXCAVATION", "GL PCC WORK", "BRICK WORK UPTO DPC", "DPC WORK", "BRICK WORK ABOVE DPC", "LINTEL BEAM & SUNSHADE WORK", "BRICK WORK ABOVE LINTEL BEAM", "SLAB WORK", "PARAPET COPING WORK", "GADAR PILLAR WORK", "PLASTERING", "PAINTING", "PLINTH PROTECTION WORK", "FLOORING"], showIf: { fieldId: "civil_type", equals: "Pump House Construction" } },
    { id: "ph_lintel", question: "Stage of work - for LINTEL BEAM & SUNSHADE", type: "Dropdown", options: ["SHUTTERING WORK", "REINFORCEMENT WORK", "CASTING WORK", "DE-SHUTTERING WORK"], showIf: { fieldId: "ph_stage", equals: "LINTEL BEAM & SUNSHADE WORK" } },
    { id: "ph_slab", question: "Stage of work - for SLAB", type: "Dropdown", options: ["SHUTTERING WORK", "REINFORCEMENT WORK", "CASTING WORK", "DE-SHUTTERING WORK"], showIf: { fieldId: "ph_stage", equals: "SLAB WORK" } },

    // --- BOUNDARY WALL BLOCK ---
    { id: "bw_type", question: "TYPE OF WORK?", type: "Dropdown", options: ["Boundary Wall", "MS Gate", "MS Wicket Gate", "Gate Pillars/Posts", "B/W Painting works"], showIf: { fieldId: "civil_type", equals: "Boundary Wall Construction" } },
    { id: "bw_stage", question: "STAGE OF WORK- BOUNDARY WALL", type: "Dropdown", options: ["GL PCC WORK", "BRICK WORK UTPO DPC", "DPC WORK", "BRICK WORK UPTO COPING", "B/W CONCRETE COPING", "PLASTERING"], showIf: { fieldId: "bw_type", equals: "Boundary Wall" } },

    // --- CAMPUS ITEMS BLOCK ---
    { id: "ci_type", question: "SPECIFY THE CAMPUS ITEMS WORK", type: "Dropdown", options: ["Chamber Works", "Semi Circular Drain work", "Recharge Pit Works", "Sign Board Fixing", "Approach Road (Campus)", "Soil levelling in Campus"], showIf: { fieldId: "civil_type", equals: "Campus Items" } },

    // --- CROSS-LINKED DI WORK BLOCK ---
    { id: "cv_di_work", question: "TYPE OF WORK - DI WORK", type: "MultiSelect", options: ["Dismantling/Excavation work", "DI/DF vertical pipe Erection", "DI Rising Main", "Thrust Block Work"], showIf: { fieldId: "civil_type", equals: "DI Pipe Works" } }
  ]
};

export const ISSUE_SCHEMA: FormField[] = [
  { id: "iss_type", question: "Report an Issue On", type: "MultipleChoice", options: ["Material Shortage", "Labour Dispute", "Design Clash", "Weather Delay", "Local Issue", "App Related Issue"] },
  { id: "iss_desc", question: "Please explain the issue clearly", type: "ShortAnswer" },
  { id: "iss_image1", question: "Issue Image 1", type: "Image" },
  { id: "iss_file", question: "Please Submit Files/Images", type: "FileUpload" }
];

export const getManpowerSchema = (discipline: string): FormField[] => {
  const fields: FormField[] = [
    { id: "mp_subcontractor", question: "Sub Contractors / Gangs", type: "Dropdown", options: ["Ramesh Gang", "Suresh Construction", "Local Gang 1", "External Fitters", "Other"] }
  ];

  if (discipline === "CIVIL") {
    fields.push(
      { id: "mp_masons", question: "Number of Masons deployed?", type: "Number" },
      { id: "mp_helpers", question: "Number of Helpers deployed?", type: "Number" }
    );
  } else if (discipline === "E&M") {
    fields.push(
      { id: "mp_helpers", question: "Number of Helpers deployed?", type: "Number" }
    );
  } else if (discipline === "PIPELINE") {
    fields.push(
      { id: "mp_fitters", question: "Number of Fitters/Plumbers deployed?", type: "Number" },
      { id: "mp_helpers", question: "Number of Helpers deployed?", type: "Number" }
    );
  } else {
    fields.push(
      { id: "mp_helpers", question: "Number of Helpers deployed?", type: "Number" }
    );
  }

  fields.push(
    { 
      id: "mp_photo", 
      question: "Site Manpower Photo", 
      type: "Image" 
    }
  );

  return fields;
};
