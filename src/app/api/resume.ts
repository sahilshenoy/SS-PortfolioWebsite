import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

// Configure the AWS S3 Client
const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: 'us-east-1', // Change this to your region
});

async function streamToBuffer(stream: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on('data', (chunk: any) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

export async function GET() {
  const params = {
    Bucket: 'our-resumes', // Replace with your S3 bucket name
    Key: 'SahilResume.pdf', // Replace with the name of the file in S3
  };

  try {
    // Create and send the command to get the object
    const command = new GetObjectCommand(params);
    const data = await s3Client.send(command);

    if (!data.Body) {
      throw new Error('Failed to retrieve the resume from S3.');
    }

    // Convert S3 stream to a Buffer
    const buffer = await streamToBuffer(data.Body);

    // Return the PDF content as a response
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
      },
    });
  } catch (error) {
    console.error('Error fetching resume from S3:', error);
    return NextResponse.json({ error: 'Failed to load resume' }, { status: 500 });
  }
}