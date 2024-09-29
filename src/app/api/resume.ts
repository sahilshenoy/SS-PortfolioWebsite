import { NextResponse } from 'next/server';
import AWS from 'aws-sdk';

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1', // Change this to your region
});

export async function GET() {
  const params = {
    Bucket: 'our-resumes', // Replace with your S3 bucket name
    Key: 'SahilResume.pdf', // Replace with the name of the file in S3
  };

  try {
    // Fetch the resume from S3
    const data = await s3.getObject(params).promise();

    // Return the PDF content as a response
    return new NextResponse(data.Body, {
      headers: {
        'Content-Type': 'application/pdf',
      },
    });
  } catch (error) {
    console.error('Error fetching resume from S3:', error);
    return NextResponse.json({ error: 'Failed to load resume' }, { status: 500 });
  }
}