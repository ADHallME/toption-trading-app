export async function GET() {
  return Response.json({ 
    error: 'API temporarily disabled to prevent rate limiting',
    success: false 
  }, { status: 503 })
}
