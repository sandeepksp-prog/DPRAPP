// Parsing Logic for CHILASNI FINAL BOQ
// user_specified: Row 11 start, Col B=ItemNo, Col C=Description

export interface BOQItem {
    itemNo: string;
    description: string;
    metadata?: any;
}

/**
 * Parses the Chilasni BOQ structure from raw row data.
 * @param rows Array of arrays representing the sheet rows (0-indexed).
 */
export function parseChilasniBOQ(rows: any[][]): BOQItem[] {
    const START_ROW_INDEX = 10; // Row 11 (0-indexed is 10)
    const END_ROW_INDEX = 391;  // User specified B391

    const COL_ITEM_NO = 1;      // Col B
    const COL_DESC = 2;         // Col C

    const items: BOQItem[] = [];

    for (let i = START_ROW_INDEX; i < rows.length; i++) {
        if (i >= END_ROW_INDEX) break;

        const row = rows[i];

        // Safety check for row length
        if (!row || row.length <= COL_DESC) continue;

        const itemNo = String(row[COL_ITEM_NO] || "").trim();
        const description = String(row[COL_DESC] || "").trim();

        // Skip empty rows or rows that look like headers/sub-headers if they don't have an item number
        // However, user said "B - ITEM NO", so we expect it to be present.
        if (itemNo) {
            items.push({
                itemNo,
                description,
                metadata: {
                    originalRow: i + 1
                }
            });
        }
    }

    return items;
}
