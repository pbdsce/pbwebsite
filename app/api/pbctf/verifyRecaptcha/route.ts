export async function POST(request: Request) {
    const { token } = await request.json();
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secretKey}&response=${token}`,
    });
  
    const data = await response.json();
  
    if (data.success && data.score > 0.5) {
      return Response.json({ success: true, score: data.score });
    }
  
    return Response.json({ error: 'Verification failed' }, { status: 400 });
  }