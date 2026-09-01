const normalizeJob = (job) => {

    return {
        externalId: job.id || "",

        title: job.title || "",

        company: job.company?.display_name || "",

        location: job.location?.display_name || "",

        description: job.description || "",

        skills: [],

        experienceRequired: null,

        salary: {
            min: job.salary_min || null,
            max: job.salary_max || null,
            isPredicted: job.salary_is_predicted === "1"
        },

        employmentType: job.contract_time || "",

        postedAt: job.created || null,

        applyUrl: job.redirect_url || "",

        source: "adzuna"
    };
};


const normalizeJobs = (jobs) => {

    return jobs.map(normalizeJob);

};


export {
    normalizeJob,
    normalizeJobs
};