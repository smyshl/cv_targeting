const { openai, openaiChatConfigJson } = require('../config/openaiConfiguration.js');
const { CvTargeter } = require('../src/utils/cvTargeter.js');


async function getTargetCv(req, res) {
    const { cv, jobDescription } = {... req.body};
    const parsedCv = JSON.parse(cv);
    // console.log('cv', parsedCv);
    

    const targetMyCv = new CvTargeter(cv, jobDescription)

    // console.log(targetMyCv.jobAnalysisPrompt);
    // console.log('resumeAdaptationPrompt', resumeAdaptationPrompt);
    

    try {
        let response = await generateOpenaiChatResponse(targetMyCv.jobAnalysisPrompt, JSON.stringify({ "job_requirements": jobDescription }), "gpt-4o", "json_object");

        const jobRequirementsAnalysis = JSON.parse(response).analysis_result

        // console.log(jobRequirementsAnalysis);

        const resumeAdaptationUserPrompt = {};
        resumeAdaptationUserPrompt.original_resume = {
            "header": {
              "title": parsedCv["1"],
            },
            "summary": parsedCv["SUMMARY"],
            "technical_skills": parsedCv["TECHNICAL SKILLS"],
            "technical_projects": parsedCv["TECHNICAL PROJECTS"],
            "experience": parsedCv["EXPERIENCE"],
            "education": parsedCv["EDUCATION"],
            "languages": parsedCv["LANGUAGES"]
          };

        resumeAdaptationUserPrompt.job_requirements = jobRequirementsAnalysis;

        // console.log('resumeAdaptationUserPrompt:', resumeAdaptationUserPrompt);


        response = await generateOpenaiChatResponse(targetMyCv.resumeAdaptationPrompt, JSON.stringify(resumeAdaptationUserPrompt), "gpt-4o", "json_object");

        console.log(JSON.parse(response));
        

        return res.status(201).json({ message: "OpenAI response successfully retrieved"});

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error. Something goes wrong" });
    }
}


function formatString(templateString, values) {
    return templateString.replace(/{(.*?)}/g, (_, key) => values[key] || '');
}


async function getOpenaiResponseFromPrompt(req, res) {

    const values = {... req.body};
    const templateString = openaiChatConfigJson.userPrompt;

    const prompt = formatString(templateString, values);

    try {
        const response = await generateOpenaiChatResponse(prompt);

        return res.status(201).json({ message: "OpenAI response successfully retrieved", response});

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error. Something goes wrong" });
    }
  };


async function generateOpenaiChatResponse(developerPrompt, userPrompt, model="gpt-4o", responseFormatType="text") {

    if(typeof developerPrompt !== "string" || typeof userPrompt !== "string"){
        throw new Error ("Developer prompt and user prompt must be type of string");
    }
    
    try {

        console.log('Sending request to the OpenAI API');

        const response = await openai.chat.completions.create({
            model,
            messages: [
                { role: 'developer', content: developerPrompt },
                { role: 'user', content: userPrompt },
            ],
            store: false,
            response_format: { "type": responseFormatType },
        });

        console.log('Token usage:');
        console.log('prompt_tokens:', response.usage.prompt_tokens);
        console.log('completion_tokens:', response.usage.completion_tokens);
        console.log('total_tokens:', response.usage.total_tokens);

        return response.choices[0].message.content;
        
    } catch (error) {
        console.log(error);
        throw error;
    }
};


module.exports = {
    getOpenaiResponseFromPrompt,
    getTargetCv,

}