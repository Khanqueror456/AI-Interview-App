import searchJobs from "../src/services/adzunaService.js";
import extractJobFeatures from "../src/services/jobFeaturesService.js";
import { normalizeJobs } from "../src/services/jobNormalizationService.js";
import calculateJobMatch from "../src/services/jobMatchingService.js";
import { candidateFeatures, jobFeatures } from "./temp.js";


const test = async () => {

    // const response = await searchJobs({
    //     country: "in",
    //     page: 1,
    //     query: "network engineer",
    //     location: "Bangalore",
    //     resultsPerPage: 10
    // });

    // console.log(response.results);
    // console.log("---------------------------------------------------------------------------------------");
    // const jobs = await normalizeJobs(response.results);
    // console.log(jobs);
    // console.log("---------------------------------------------------------------------------------------");

    // for (const job of jobs)
    // {
    //     const jobFeatures = await extractJobFeatures(job);
    //     console.log(jobFeatures);
    // }

    const result = await calculateJobMatch(candidateFeatures, jobFeatures);

    console.log(result);


};



test();