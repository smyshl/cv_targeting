const { openai, openaiChatConfigJson } = require('../config/openaiConfiguration.js');
const { CvTargeter } = require('../src/utils/cvTargeter.js');


async function getTargetCv(req, res) {
    const { cv, jobDescription } = {... req.body};
    // console.log(cv, jobDescription);
    

    const targetMyCv = new CvTargeter(cv, jobDescription)

    // console.log(targetMyCv.jobAnalysisPrompt);
    // console.log('resumeAdaptationPrompt', resumeAdaptationPrompt);
    

    try {
        // const response = await generateOpenaiChatResponse(prompt);

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: 'developer', content: targetMyCv.jobAnalysisPrompt },
                { role: 'user', content: JSON.stringify({
                    "job_requirements": jobDescription
                  }) },
            ],
            store: false,
            response_format: { "type": "json_object" },
        });

        console.log('Token usage:');
        console.log('prompt_tokens:', response.usage.prompt_tokens);
        console.log('completion_tokens:', response.usage.completion_tokens);
        console.log('total_tokens:', response.usage.total_tokens);

        console.log(response.choices[0].message.content);

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


async function generateOpenaiChatResponse(userPrompt) {

    const { developerPrompt, model } = openaiChatConfigJson;

    // console.log(userPrompt);
    
    
    try {

        const response = await openai.chat.completions.create({
            model,
            messages: [
                { role: 'developer', content: developerPrompt },
                { role: 'user', content: userPrompt },
            ],
            store: false,
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