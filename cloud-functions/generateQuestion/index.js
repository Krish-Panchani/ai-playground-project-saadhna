const { VertexAI } = require('@google-cloud/vertexai');

exports.generateQuestion = async (req, res) => {
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
    const projectId = process.env.PROJECT_ID;
    const location = 'us-central1';
    const model = 'gemini-1.5-flash-001';
    

    const prompt = `Generate only one easy Question that Ask user to draw something that can be drawn on Canvas of webpage.
It can be Alphabets, Numbers, Shapes, Objects, Animals, Birds, Fruits, Vegetables, Vehicles, etc.
question should be Unique every time
Example 1. Draw a house.
Example 2. Draw a cat.
Example 3. Draw a Number 2.
`;


    // Initialize Vertex with your Cloud project and location
    const vertexAI = new VertexAI({ project: projectId, location: location });

    // Instantiate the model
    const generativeModel = vertexAI.getGenerativeModel({
      model: model,
    });



    console.log(`Prompt Text: ${prompt}`);

    console.log('Non-Streaming Response Text:');

    // Generate a response
    const response = await generativeModel.generateContent(prompt);
    const contentResponse = await response.response;

    // Select the text from the response
    const fullTextResponse =
    JSON.stringify(contentResponse)

    console.log(fullTextResponse);

    res.status(200).send(fullTextResponse);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
};
