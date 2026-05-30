import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/server';
import { ALL_SCHEMES, BLOCK_SCHEMES, SCHEME_MAP } from '@/lib/scheme-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const ref = db.ref('pms_portal/schemes');
    const snapshot = await ref.once('value');
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      return NextResponse.json({ success: true, source: 'firebase', data });
    }
    
    // Fallback to local hardcoded data
    return NextResponse.json({ 
      success: true, 
      source: 'local_fallback', 
      data: {
        all: ALL_SCHEMES,
        byBlock: BLOCK_SCHEMES,
        map: SCHEME_MAP
      } 
    });
  } catch (error: any) {
    console.error('Error fetching schemes from RTDB:', error);
    
    // Fallback on error
    return NextResponse.json({ 
      success: true, 
      source: 'local_fallback', 
      data: {
        all: ALL_SCHEMES,
        byBlock: BLOCK_SCHEMES,
        map: SCHEME_MAP
      } 
    });
  }
}
