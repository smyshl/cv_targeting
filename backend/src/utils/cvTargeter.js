class CvTargeter{
    constructor(cv, jobDescription){
        this.cv = cv;
        this.jobDescription = jobDescription;
        this.jobAnalysisPrompt = jobDescription;
        this.resumeAdaptationPrompt = '';
        this.jobAnalysisResult = {};
    }

    set jobAnalysisPrompt(qwer) {
      // console.log('jobDescription', qwer);
      
        return this._jobAnalysisPrompt = `You are an expert ATS (Applicant Tracking System) analyzer. Your task is to analyze job requirements and extract key information that will be crucial for resume optimization.

Input format:
${JSON.stringify({
  "job_requirements": "full text of job requirements"
}, null, 2)}

Instructions:
1. Analyze the job requirements carefully to identify:
   - Must-have technical skills and technologies
   - Required experience levels and types
   - Educational requirements
   - Essential soft skills
   - Industry-specific terminology

2. Categorize requirements by priority:
   - High priority: explicitly stated as "required", "must have", or mentioned multiple times
   - Medium priority: mentioned as "preferred", "desired", or listed without emphasis
   - Low priority: mentioned as "nice to have" or listed as optional

3. Do not infer or add requirements that are not stated in the original text

Please provide output in the following JSON format:
${JSON.stringify({
  "analysis_result": {
    "essential_requirements": {
      "technical_skills": [],
      "experience": [],
      "education": [],
      "soft_skills": []
    },
    "keywords_priority": {
      "high_priority": [],
      "medium_priority": [],
      "low_priority": []
    },
    "industry_specific_terms": []
  }
}, null, 2)}
`;
    }

    get jobAnalysisPrompt(){
      return this._jobAnalysisPrompt;
    }

    async analyseJobRequirements(aiRequestFunction){
      this.jobAnalysisResult = await aiRequestFunction(this._jobAnalysisPrompt);
      return this.jobAnalysisResult;
    }
    
}

const jobAnalysisPrompt = `You are an expert ATS (Applicant Tracking System) analyzer. Your task is to analyze job requirements and extract key information that will be crucial for resume optimization.

Input format:
${JSON.stringify({
  "job_requirements": "full text of job requirements"
}, null, 2)}

Instructions:
1. Analyze the job requirements carefully to identify...
[остальные инструкции]

Please provide output in the following JSON format:
${JSON.stringify({
  "analysis_result": {
    "essential_requirements": {
      "technical_skills": [],
      "experience": [],
      "education": [],
      "soft_skills": []
    },
    "keywords_priority": {
      "high_priority": [],
      "medium_priority": [],
      "low_priority": []
    },
    "industry_specific_terms": []
  }
}, null, 2)}
`;


const resumeAdaptationPrompt = `You are an expert ATS resume optimizer...

Input format:
${JSON.stringify({
  "original_resume": "// JSON structure of the resume",
  "job_analysis": "// Analysis results from previous step"
}, null, 2)}

[инструкции]

Output format:
${JSON.stringify({
  "modified_resume": "// Same structure as input resume",
  "matching_metrics": {
    "overall_match_percentage": 0,
    "matched_keywords": {
      "technical_skills": [],
      "soft_skills": [],
      "experience": []
    },
    "missing_requirements": [],
    "modifications_made": []
  }
}, null, 2)}
`;


module.exports = {
    CvTargeter,

}