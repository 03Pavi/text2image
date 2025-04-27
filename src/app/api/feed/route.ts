import { NextResponse } from 'next/server';

export async function GET() {
  // Create a new readable stream
  const stream = new ReadableStream({
    start(controller) {
      const fetchAndSendData = async () => {
        try {
          const response = await fetch('https://image.pollinations.ai/feed');
          if (!response.ok) {
            throw new Error('Failed to fetch data from the external API');
          }

          const data = await response.json();
          controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
        } catch (error) {
          controller.enqueue(`data: {"error": "Failed to fetch data"}\n\n`);
          console.error('Error fetching data from external API:', error);
        }
      };

      // Send data every 10 seconds
      const interval = setInterval(fetchAndSendData, 10000);

      // Clear the interval when the stream is closed
      controller.close = () => {
        clearInterval(interval); // Cleanup the interval when stream is closed
      };
    }
  });

  // Return the response with the stream
  const res = new NextResponse(stream);
  res.headers.set('Content-Type', 'text/event-stream');
  res.headers.set('Cache-Control', 'no-cache');
  res.headers.set('Connection', 'keep-alive');

  return res;
}
