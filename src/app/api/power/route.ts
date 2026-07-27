import { NextResponse } from 'next/server';
import { getSwitches, getSwitch, updateSwitch, setAllSwitches } from '@/lib/powerStore';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    const s = getSwitch(id);
    if (!s) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(s);
  }

  const switches = getSwitches();
  return NextResponse.json(switches);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Support batch update
    if (body.action === 'setAll') {
      const updated = setAllSwitches(body.state);
      return NextResponse.json(updated);
    }

    // Support single update
    const { id, state } = body;
    if (id && typeof state === 'boolean') {
      const updated = updateSwitch(id, state);
      return NextResponse.json(updated.find(s => s.id === id));
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
