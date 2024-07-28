const { Storage } = require('@google-cloud/storage');
const { v4: uuidv4 } = require('uuid');

const storage = new Storage({
  projectId: "<YOUR-PROJECT-ID>",
});

exports.generateSignedUrls = async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }

  const bucketName = 'ai-playground-images';
  const originalFileName = req.query.objectName;
  const action = req.query.action; // 'upload' or 'read'

  if (!originalFileName && action === 'upload') {
    return res.status(400).json({ error: 'objectName and action query parameters are required' });
  }

  if (!req.query.uniqueFileName && action === 'read') {
    return res.status(400).json({ error: 'uniqueFileName and action query parameters are required' });
  }

  const uniqueFileName = action === 'upload' ? `${Date.now()}-${uuidv4()}-${originalFileName}` : req.query.uniqueFileName;

  let signedUrl;
  const expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + 15);

  try {
    if (action === 'upload') {
      [signedUrl] = await storage.bucket(bucketName).file(uniqueFileName).getSignedUrl({
        version: 'v4',
        action: 'write',
        expires: expiration,
      });
    } else if (action === 'read') {
      [signedUrl] = await storage.bucket(bucketName).file(uniqueFileName).getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: expiration,
      });
    } else {
      return res.status(400).json({ error: 'Invalid action parameter. Use "upload" or "read".' });
    }

    res.json({ signedUrl, uniqueFileName });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    res.status(500).json({ error: 'Error generating signed URL' });
  }
};
