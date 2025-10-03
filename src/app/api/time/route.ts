// app/api/time/route.ts
export async function GET() {
    return Response.json({ time: new Date().toISOString() });
}