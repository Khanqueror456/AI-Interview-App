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

    // const resume = await Resume.findOne({
    //     _id : resumeId,
    //     user : userId
    // });

    // const parsedData = resume.parsedData;


    // const normalizedResume = normalizeResume(parsedData);

    // const candidateFeatures = extractCandidateFeatures(normalizedResume);

    // const response = await searchJobs({
    //     country: country,
    //     page: 1,
    //     query: role,
    //     location: location,
    //     resultsPerPage: 10
    // });

    // console.log(response.results);
    // console.log("---------------------------------------------------------------------------------------");
    // const jobs = await normalizeJobs(response.results);
    // console.log(jobs);
    // console.log("---------------------------------------------------------------------------------------");

    // const jobsFeatures = [];
    // for (const job of jobs) {
    //     const jobFeatures = await extractJobFeatures(job);
    //     console.log(jobFeatures);
    //     jobsFeatures.push(jobFeatures);

    // }

    // const result = await calculateJobMatch(candidateFeatures, jobsFeatures);

    // console.log(result);

 const result = {

  overallRelevance: 87,

  jobMatches: [
    {
      jobId: "JOB001",
      jobTitle: "Network Engineer",

      overallScore: 92,

      roleMatch: {
        score: 95,
        reason: "The candidate's experience closely matches the requirements for a Network Engineer role."
      },

      experienceMatch: {
        score: 90,
        reason: "The candidate has 3+ years of networking experience, matching the required experience level."
      },

      skillMatch: {
        score: 94,
        matched: [
          "Cisco",
          "TCP/IP",
          "Routing",
          "Switching",
          "CCNA",
          "Firewalls",
          "VPN"
        ],
        missing: [
          "AWS Networking"
        ],
        reason: "The candidate has strong networking fundamentals and Cisco experience, but lacks AWS networking experience."
      },

      summary: "Excellent match for the Network Engineer position with strong networking, routing, switching, and firewall experience."
    },

    {
      jobId: "JOB002",
      jobTitle: "Network Security Engineer",

      overallScore: 88,

      roleMatch: {
        score: 86,
        reason: "The candidate's networking background aligns well with the network security responsibilities."
      },

      experienceMatch: {
        score: 84,
        reason: "The candidate has relevant networking experience but limited dedicated network security experience."
      },

      skillMatch: {
        score: 89,
        matched: [
          "Firewalls",
          "VPN",
          "TCP/IP",
          "Cisco",
          "Network Troubleshooting",
          "IDS/IPS"
        ],
        missing: [
          "Palo Alto",
          "Fortinet",
          "SIEM"
        ],
        reason: "Strong foundational network security skills, although experience with enterprise security platforms is limited."
      },

      summary: "Good match for a Network Security Engineer role, particularly due to firewall, VPN, and network troubleshooting experience."
    },

    {
      jobId: "JOB003",
      jobTitle: "Systems and Network Administrator",

      overallScore: 85,

      roleMatch: {
        score: 88,
        reason: "The candidate's networking experience fits the network administration responsibilities of the role."
      },

      experienceMatch: {
        score: 87,
        reason: "The candidate has sufficient infrastructure and networking experience for this position."
      },

      skillMatch: {
        score: 83,
        matched: [
          "Linux",
          "Windows Server",
          "TCP/IP",
          "DNS",
          "DHCP",
          "Cisco",
          "Network Troubleshooting"
        ],
        missing: [
          "Active Directory",
          "PowerShell"
        ],
        reason: "The candidate has strong infrastructure and networking skills but has limited evidence of Active Directory and PowerShell experience."
      },

      summary: "Strong candidate for a systems and network administration position with good infrastructure and troubleshooting experience."
    },

    {
      jobId: "JOB004",
      jobTitle: "Cloud Network Engineer",

      overallScore: 78,

      roleMatch: {
        score: 76,
        reason: "The candidate's traditional networking experience provides a good foundation for cloud networking."
      },

      experienceMatch: {
        score: 72,
        reason: "The candidate has relevant networking experience but limited professional cloud networking experience."
      },

      skillMatch: {
        score: 75,
        matched: [
          "TCP/IP",
          "Routing",
          "VPN",
          "Firewalls",
          "DNS"
        ],
        missing: [
          "AWS VPC",
          "Azure Virtual Network",
          "AWS Transit Gateway",
          "Terraform"
        ],
        reason: "Strong traditional networking skills, but several cloud-specific technologies required by the role are missing."
      },

      summary: "Moderate-to-good match. The candidate has a strong networking foundation but would need additional cloud networking experience."
    },

    {
      jobId: "JOB005",
      jobTitle: "Network Operations Engineer",

      overallScore: 90,

      roleMatch: {
        score: 93,
        reason: "The candidate's networking and troubleshooting background closely matches the responsibilities of a Network Operations Engineer."
      },

      experienceMatch: {
        score: 89,
        reason: "The candidate's experience with network monitoring and troubleshooting aligns well with the required experience."
      },

      skillMatch: {
        score: 91,
        matched: [
          "Network Monitoring",
          "Cisco",
          "TCP/IP",
          "Routing",
          "Switching",
          "SNMP",
          "Network Troubleshooting",
          "VPN"
        ],
        missing: [
          "SolarWinds"
        ],
        reason: "The candidate has most of the required networking and monitoring skills, with only limited experience in the specific monitoring platform."
      },

      summary: "Excellent match for a Network Operations Engineer role due to strong networking, monitoring, and troubleshooting skills."
    }
  ],
}

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
})
