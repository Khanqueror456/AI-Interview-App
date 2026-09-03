import asyncHandler from "../utils/asyncHandler.js";
import normalizeResume from "../services/resumeNormalizationService.js";
import extractCandidateFeatures from "../services/candidateFeatureService.js";
import searchJobs from "../services/adzunaService.js";
import { normalizeJobs } from "../services/jobNormalizationService.js";
import extractJobFeatures from "../services/jobFeaturesService.js";
import calculateJobMatch from "../services/jobMatchingService.js";
import Resume from "../models/Resume.js";
import JobMatch from "../models/JobMatch.js";

export const searchAndMatchJobs = asyncHandler(async (req, res) => {

    const resumeId = req.params.id;
    const userId = req.user.id;
    const {country = "in", role = "network engineer", location="Bangalore"} = req.body;

    const resume = await Resume.findOne({
        _id : resumeId,
        user : userId
    });

    const parsedData = resume.parsedData;


    const normalizedResume = normalizeResume(parsedData);

    const candidateFeatures = extractCandidateFeatures(normalizedResume);

    const response = await searchJobs({
        country: country,
        page: 1,
        query: role,
        location: location,
        resultsPerPage: 10
    });

    console.log(response.results);
    console.log("---------------------------------------------------------------------------------------");
    const jobs = await normalizeJobs(response.results);
    console.log(jobs);
    console.log("---------------------------------------------------------------------------------------");

    const jobsFeatures = [];
    for (const job of jobs) {
        const jobFeatures = await extractJobFeatures(job);
        console.log(jobFeatures);
        jobsFeatures.push(jobFeatures);

    }

    const result = await calculateJobMatch(candidateFeatures, jobsFeatures);

    console.log(result);

    const jobMatches = await JobMatch.create({
        resumeId : resumeId,
        candidateId : userId,
        searchCriteria : {
            country : country,
            role : role,
            location : location
        },
        overallRelevance : result.overallRelevance,
        jobMatches : result.jobMatches
    });

    return res.status(200).json(jobMatches._id);

})


export const getJobMatches = asyncHandler(async (req, res) => {

    const userId = req.user.id;
    const jobMatchesId = req.params.id;

    console.log("In Da Club");

    const jobMatches = await JobMatch.findOne({
        _id : jobMatchesId,
        candidateId : userId
    });

    if (!jobMatches)
    {
        return res.status(400).json({message : "Job matches not found"});
    }

    return res.status(200).json(jobMatches);
});

export const getJobsMatches = asyncHandler(async (req, res) => {

  const userId = req.user.id;
  const resumeId = req.params.id;

  console.log(userId, resumeId);

  const jobsMatches = await JobMatch.find({
    candidateId: userId,
    resumeId : resumeId
  }) || [];

  if (jobsMatches.length == 0)
  {
    return res.status(404).json({message : "No job matches found"});
  }

  return res.status(200).json(jobsMatches);
})
