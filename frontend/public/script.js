import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs';

const cvTextElement = document.getElementById('cvText');
const jobDescriptionTextElement = document.getElementById('jobDescriptionText');
const startTargetingButton = document.getElementById('startTargeting');
const targetedCvTextElement = document.getElementById('targetedCvText');
const uploadCvPdfInput = document.getElementById('uploadCvPdf');


pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs'


async function extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        let pageText = '';
        
        for (const item of textContent.items) {
            // console.log(item);

            if (!item.str && item.hasEOL) {
                pageText += '\n';
            }

            pageText += item.str;
        }
        fullText += pageText + '\n';
    }
    return fullText;
}


function parsePdfStructure(text){
        // console.log(JSON.stringify(text));
    const sections = text.split('\n').filter(Boolean);
    // console.table(sections);
    // console.log(JSON.stringify(sections, null, 2));
    const structuredData = {};
    let currentTitle = '';

    for(let line = 0; line < sections.length; line++) {
        // console.warn(sections[line].toUpperCase(), sections[line].length, sections[line]);        
        if(sections[line].toUpperCase() === sections[line] && sections[line].length > 0){
            currentTitle = sections[line];
            structuredData[currentTitle] = [];
            console.warn(currentTitle);
            
        }else {
            if(currentTitle){
                structuredData[currentTitle].push(sections[line]);
            }else {
                structuredData[line] = sections[line]
            };
        };
    }
        console.dir(JSON.stringify(structuredData, null, 2));
    return structuredData;
}


uploadCvPdfInput.addEventListener('change', async (e) => {

    cvTextElement.value = 'Reading your CV...';

    const file = e.target.files[0];
    // console.log(file);

    if (file) {
        const text = await extractTextFromPDF(file);
        cvTextElement.value = text;
        // parsePdfStructure(text);
    }
})


startTargetingButton.addEventListener('click', async (e) => {
    const cvText = JSON.stringify(parsePdfStructure(cvTextElement.value));
    const jobDescriptionText = jobDescriptionTextElement.value;

    if( !(cvText && jobDescriptionText)) {
        alert(`Please fill your CV and job description fields ${cvText}`);
        return;
    };

    targetedCvTextElement.value = "Targeting your CV..."

    const chatResponse = await getChatResponse(cvText, jobDescriptionText);

    targetedCvTextElement.value = chatResponse.response;

})


async function getChatResponse(cvText, jobDescriptionText) {

    try {
        const response = await fetch('/api/chat/targetcv', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cv: cvText, jobDescription: jobDescriptionText})
        });

        if(!response.ok){
            return "Response is not OK:" + response.status;
        };

        return await response.json();

    } catch (error) {
        console.log('Error', error);
    }
}