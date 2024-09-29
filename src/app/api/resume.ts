import { NextApiRequest, NextApiResponse } from 'next';
import AWS from 'aws-sdk';

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1', // Change this to your region
});
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const params = {
      Bucket: 'our-resumes', // Replace with your S3 bucket name
      Key: 'SahilResume.pdf', // Replace with the name of the file in S3
    };
  
    try {
      // Fetch the resume from S3
      const data = await s3.getObject(params).promise();
  
      // Set the content type and send the PDF file
      res.setHeader('Content-Type', 'application/pdf');
      res.send(data.Body);
    } catch (error) {
      console.error('Error fetching resume from S3:', error);
      res.status(500).json({ error: 'Failed to load resume' });
      }
    }
