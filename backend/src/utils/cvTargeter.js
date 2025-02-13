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
   - The formal job title as stated in the requirements 
   - The actual job title that most accurately matches requirements
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
    "job_title": {
      "stated": "",
      "actual": ""
    },
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


    set resumeAdaptationPrompt(qwer) {
      // console.log('jobDescription', qwer);
      
        return this._resumeAdaptationPrompt = `You are an expert ATS resume optimizer. Your task is to adapt the provided resume to match job requirements while maintaining truthfulness and authenticity of the original resume.

Input format:
${JSON.stringify({
  "original_resume": {
    "header": {
      "title": "1",
    },
    "summary": "SUMMARY",
    "technical_skills": "TECHNICAL SKILLS",
    "technical_projects": "TECHNICAL PROJECTS",
    "experience": "EXPERIENCE",
    "education": "EDUCATION",
    "languages": "LANGUAGES"
  },
  "job_requirements": {
    "job_title": {
      "stated": "",
      "actual": ""
    },
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

Instructions:
1. Analyze both the resume and job requirements
2. For each section of the resume:
   - Align terminology with job requirements where appropriate
   - Emphasize relevant skills and experiences
   - Maintain the original meaning and truthfulness
   - Do not add skills or experiences not present in the original

3. Matching rules:
   - Aim for 75-80% keyword match with job requirements
   - Prioritize matching high-priority keywords
   - Use exact phrases from job requirements when they match existing skills
   - Keep modifications minimal but effective

4. Special attention:
   - Technical skills: Use exact terminology from job requirements when matching
   - Experience: Emphasize relevant responsibilities and achievements
   - Summary: Align with key job requirements while maintaining authenticity

Output must be in the exact same JSON structure as the input resume with an additional matching_metrics section.

Output format:
${JSON.stringify({
  "modified_resume": {
    "header": {
      "title": "",
    },
    "summary": "",
    "technical_skills": "",
    "technical_projects": "",
    "experience": "",
    "education": "",
    "languages": ""
  },
  "matching_metrics": {
    "overall_match_percentage": 0,
    "matched_keywords": {
      "technical_skills": [],
      "soft_skills": [],
      "experience": []
    },
    "missing_requirements": [],
    "modifications_made": [
      {
        "section": "",
        "original_text": "",
        "modified_text": "",
        "reason": ""
      }
    ]
  }
}, null, 2)}
`;
    }

    get resumeAdaptationPrompt(){
      return this._resumeAdaptationPrompt;
    }



    async analyseJobRequirements(aiRequestFunction){
      this.jobAnalysisResult = await aiRequestFunction(this._jobAnalysisPrompt);
      return this.jobAnalysisResult;
    }
    
}


module.exports = {
    CvTargeter,

}