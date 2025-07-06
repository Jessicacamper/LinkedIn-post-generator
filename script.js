document.getElementById('generateBtn').addEventListener('click', generatePosts);

async function generatePosts() {
    const userInput = document.getElementById('userInput').value;
    const generateBtn = document.getElementById('generateBtn');
    const loader = document.getElementById('loader');
    const resultDiv = document.getElementById('result');

    if (!userInput) {
        alert('Please enter a topic!');
        return;
    }

    // Show loader and disable button
    generateBtn.disabled = true;
    generateBtn.innerText = 'Generating...';
    loader.style.display = 'block';
    resultDiv.innerHTML = '';

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: userInput }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        resultDiv.innerText = data.result;

    } catch (error) {
        resultDiv.innerText = 'Failed to generate posts. Please try again later.';
        console.error('Error:', error);
    } finally {
        // Hide loader and re-enable button
        generateBtn.disabled = false;
        generateBtn.innerText = 'Generate Posts';
        loader.style.display = 'none';
    }
}