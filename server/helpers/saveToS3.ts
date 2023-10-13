import { S3, GetObjectRequest, PutObjectRequest, HeadObjectRequest } from "@aws-sdk/client-s3";
import dayjs from 'dayjs';


const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_S3_LOGS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_LOGS_ACCESS_KEY_SECRET,
  },
  region: 'us-east-1' // e.g., 'us-east-1'
});

// Define types
interface JSONData {
  [key: string]: any;
}

// Asynchronous function to append JSON data to an existing S3 file
export async function appendJSONToS3(jsonData: JSONData, bucketName: string, objectKey: string): Promise<void> {
  try {
    let existingJSONData: JSONData[] = [];

    // Check if the object exists in S3
    const headObjectParams: HeadObjectRequest = {
      Bucket: bucketName,
      Key: objectKey
    };

    try {
      // Attempt to retrieve the existing object metadata
      await s3.headObject(headObjectParams);
      // If the object exists, get its content
      const getObjectParams: GetObjectRequest = {
        Bucket: bucketName,
        Key: objectKey
      };
      const existingObject = await s3.getObject(getObjectParams);
      let existingJSONString = await streamToString(existingObject.Body);
      if (existingJSONString) {
        existingJSONData = JSON.parse(String(existingJSONString));
      }

    } catch (err) {
      console.log(err)
      // If the object doesn't exist, it will throw an error, which we can ignore
    }

    // Ensure existingJSONData is an array
    if (!Array.isArray(existingJSONData)) {
      existingJSONData = [];
    }

    // Append the new JSON data to the existing array
    existingJSONData.push(jsonData);

    // Upload the updated JSON data
    const putObjectParams: PutObjectRequest = {
      Bucket: bucketName,
      Key: objectKey,
      Body: JSON.stringify(existingJSONData),
      ContentType: 'application/json'
    };

    await s3.putObject(putObjectParams);

    console.log('JSON data appended successfully to:', objectKey);
  } catch (err) {
    console.error('Error appending JSON data to S3:', err);
  }
}

const streamToString = (stream) => new Promise((resolve, reject) => {
  const chunks = [];
  stream.on('data', (chunk) => chunks.push(chunk));
  stream.on('error', reject);
  stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
});

// Function to append JSON data to an existing S3 file
export function appendToExistingS3File(jsonData: JSONData): void {
  const bucketName = 'lendas-logs';
  const objectKey = `caship-notification-${dayjs().format('YYYY-MM-DD')}.json`;
  appendJSONToS3(jsonData, bucketName, objectKey);
}
