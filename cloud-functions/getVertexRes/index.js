const { VertexAI } = require('@google-cloud/vertexai');

exports.getVertexRes = async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }
  
  try {
    const projectId = '<YOUR-PROJECT-ID>';
    const location = 'us-central1';
    const model = 'gemini-1.5-flash-001';
    
    const { fileName, prompt } = req.body;
    const imageUri = `gs://ai-playground-images/${fileName}`;
    const mimeType = 'image/png'; // Update this if necessary based on your file types

    // Initialize Vertex with your Cloud project and location
    const vertexAI = new VertexAI({ project: projectId, location: location });

    // Instantiate the model
    const generativeVisionModel = vertexAI.getGenerativeModel({
      model: model,
    });

    // For images, the SDK supports both Google Cloud Storage URI and base64 strings
    const filePart = {
      fileData: {
        fileUri: imageUri,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: prompt,
    };

    const request = {
      contents: [{ role: 'user', parts: [filePart, textPart] }],
    };

    console.log('Prompt Text:');
    console.log(request.contents[0].parts[1].text);

    console.log('Non-Streaming Response Text:');

    // Generate a response
    const response = await generativeVisionModel.generateContent(request);

    // Select the text from the response
    const fullTextResponse =
      response.response.candidates[0].content.parts[0].text;

    console.log(fullTextResponse);

    res.status(200).send(fullTextResponse);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
};
