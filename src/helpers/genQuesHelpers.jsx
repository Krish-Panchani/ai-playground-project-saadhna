export const handleDrawingComplete = (dataUrl, setFile) => {
    const byteString = atob(dataUrl.split(',')[1]);
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    const buffer = new ArrayBuffer(byteString.length);
    const data = new Uint8Array(buffer);
    for (let i = 0; i < byteString.length; i++) {
        data[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([buffer], { type: mimeString });
    setFile(new File([blob], 'drawing.png', { type: mimeString }));
};

export const handleUpload = async (file, setLoadingUpload, setUniqueFileName, handleSendPrompt, prompt, setResponseText, setLoadingResponse, setScore) => {
    if (!file) {
        alert('Please complete a drawing to upload');
        return;
    }

    setLoadingUpload(true);

    try {
        const uploadResponse = await fetch(`${process.env.REACT_APP_UPLOAD_URL}?action=upload&objectName=${file.name}`);
        if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            throw new Error(errorData.error || 'Error generating upload signed URL');
        }
        const uploadData = await uploadResponse.json();
        const uploadSignedUrl = uploadData.signedUrl;
        const uniqueFileName = uploadData.uniqueFileName;
        setUniqueFileName(uniqueFileName);

        const xhr = new XMLHttpRequest();
        xhr.open('PUT', uploadSignedUrl, true);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.onload = async () => {
            if (xhr.status === 200) {
                alert('Drawing uploaded to AI - Successfully');
                await handleSendPrompt(uniqueFileName, prompt, setResponseText, setLoadingResponse, setScore);
            } else {
                alert('File upload failed');
            }
            setLoadingUpload(false);
        };
        xhr.onerror = () => {
            alert('An error occurred during the upload');
            setLoadingUpload(false);
        };
        xhr.send(file);
    } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file: ' + error.message);
        setLoadingUpload(false);
    }
};

export const handleSendPrompt = async (fileName, prompt, setResponseText, setLoadingResponse, setScore) => {
    setLoadingResponse(true);

    try {
        const response = await fetch(process.env.REACT_APP_GET_IMAGE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileName, prompt }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error getting response from cloud function');
        }

        const responseText = await response.text();
        const responseData = JSON.parse(responseText);

        setResponseText(responseText);
        setLoadingResponse(false);
        setScore(prevScore => prevScore + (responseData.points || 0));

    } catch (error) {
        console.error('Error getting response from cloud function:', error);
        alert('Error getting response from cloud function: ' + error.message);
        setLoadingResponse(false);
    }
};

export const handleGenerateQuestion = async (setLoadingQuestion, setQuestion, setPrompt, canvasRef, setResponseText) => {
    setLoadingQuestion(true);

    try {
        const response = await fetch(process.env.REACT_APP_GENERATE_QUESTION_URL);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error generating question');
        }
        const questionText = await response.text();
        setQuestion(questionText);
        setPrompt(questionText);
        setResponseText(''); // Clear the responseText here
        setLoadingQuestion(false);

        if (canvasRef.current) {
            canvasRef.current.clearCanvas();
        }
    } catch (error) {
        console.error('Error generating question:', error);
        alert('Error generating question: ' + error.message);
        setLoadingQuestion(false);
    }
};
