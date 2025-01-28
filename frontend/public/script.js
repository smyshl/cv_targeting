console.log('хуй');

const cvTextElement = document.getElementById('cvText');
const jobDescriptionTextElement = document.getElementById('jobDescriptionText');
const startTargetingButton = document.getElementById('startTargeting');
const targetedCvTextElement = document.getElementById('targetedCvText');


startTargetingButton.addEventListener('click', async (e) => {
    const cvText = cvTextElement.value;
    const jobDescriptionText = jobDescriptionTextElement.value;

    console.log(cvText, jobDescriptionText);
    

    if( !(cvText && jobDescriptionText)) {
        alert(`Please fill your CV and job description fields ${cvText}`);
        return;
    };

    const chatResponse = await getChatResponse(cvText, jobDescriptionText);

    targetedCvTextElement.value = JSON.stringify(chatResponse);

})


async function getChatResponse(cvText, jobDescriptionText) {

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cv: cvText, job: jobDescriptionText})
        });

        if(!response.ok){
            throw new Error("Response not OK:" + response.status);
        };

        return await response.json();

    } catch (error) {
        console.log('Error', error);
    }
}