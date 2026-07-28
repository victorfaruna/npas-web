import { NextResponse } from 'next/server';
import { getSwitches, getSwitch, updateSwitch, setAllSwitches } from '@/lib/powerStore';

// Helper to get live state from ESP
async function getEspState() {
  const espUrl = process.env.ESP32_WEBHOOK_URL;
  if (!espUrl) return null;
  
  try {
    const res = await fetch(espUrl, { 
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });
    if (res.ok) {
      return await res.json(); // Expected format: { "switch-1": true }
    }
  } catch (e) {
    console.error("[Power API] Failed to get ESP state:", e);
  }
  return null;
}

// Helper to post live state to ESP
async function postEspState(id: string, state: boolean) {
  const espUrl = process.env.ESP32_WEBHOOK_URL;
  if (!espUrl) return false;
  
  try {
    const res = await fetch(espUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, state })
    });
    return res.ok;
  } catch (e) {
    console.error(`[Power API] Failed to POST to ESP32 at ${espUrl}:`, e);
    return false;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  const espState = await getEspState();

  if (id) {
    const s = getSwitch(id);
    if (!s) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    // Merge live ESP state if available
    if (espState && typeof espState[id] === 'boolean') {
      s.state = espState[id];
      updateSwitch(id, espState[id]); 
    }
    return NextResponse.json(s);
  }

  const switches = getSwitches();
  if (espState) {
    switches.forEach(s => {
      if (typeof espState[s.id] === 'boolean') {
        s.state = espState[s.id];
        updateSwitch(s.id, espState[s.id]);
      }
    });
  }
  return NextResponse.json(switches);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const espUrl = process.env.ESP32_WEBHOOK_URL;
    
    // Support batch update
    if (body.action === 'setAll') {
      if (espUrl) {
         try {
           await fetch(espUrl, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ action: 'setAll', state: body.state })
           });
         } catch (e) {
           console.error("[Power API] ESP toggleAll failed", e);
         }
      }
      const updated = setAllSwitches(body.state);
      return NextResponse.json(updated);
    }

    // Support single update
    const { id, state } = body;
    if (id && typeof state === 'boolean') {
      // Await ESP32 so the UI load step stays active while the request is ongoing
      await postEspState(id, state).catch(console.error);
      
      // Update local store as fallback/cache
      const updated = updateSwitch(id, state);
      return NextResponse.json(updated.find(s => s.id === id));
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

