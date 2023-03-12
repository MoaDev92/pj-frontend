export const FRONTEND_URI = process.env.FRONTEND_URI || "http://localhost:3000";
export const BACKEND_URI = process.env.BACKEND_URI || "http://localhost:1337";

export const JOB_API =
  process.env.JOB_API || "https://jobsearch.api.jobtechdev.se/search";

export const JOB_API_KEY =
  process.env.JOB_API_KEY || "Y29tbXVuaXR5QGpvYnRlY2hkZXYuc2U";

export const JOB_API_REGION =
  process.env.JOB_API_REGION ||
  "https://taxonomy.api.jobtechdev.se/v1/taxonomy/specific/concepts/region?limit=21";

export const JOB_SSYK_OCCUPATIONS =
  process.env.JOB_SSYK_OCCUPATIONS ||
  "https://taxonomy.api.jobtechdev.se/v1/taxonomy/specific/concepts/ssyk";

export const JOB_API_MUNICIPALITIES =
  process.env.JOB_API_MUNICIPALITIE ||
  "https://taxonomy.api.jobtechdev.se/v1/taxonomy/specific/concepts/municipality";

export const JOB_API_EMPLOYER =
  process.env.JOB_API_EMPLOYER ||
  "https://jobsearch.api.jobtechdev.se/search?employer=";

export const JOB_API_JOBYID =
  process.env.JOB_API_JOBYID || "https://jobsearch.api.jobtechdev.se/ad";

export const JOB_API_JOBLOGO =
  process.env.JOB_API_JOBLOGO ||
  "https://jobsearch.api.jobtechdev.se/ad/JOBID/logo";

export const THEME_TEXT_COLOR =
  process.env.THEME_TEXT_COLOR || "text-indigo-500";
