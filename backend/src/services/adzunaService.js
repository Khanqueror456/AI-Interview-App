import axios from "axios";


const ADZUNA_BASE_URL =
    "https://api.adzuna.com/v1/api";


const searchJobs = async ({
    country = "in",
    page = 1,
    query,
    location,
    resultsPerPage = 20
}) => {

    try {

        console.log(process.env.ADZUNA_API_ID, process.env.ADZUNA_API_KEY);

        const response = await axios.get(
            `${ADZUNA_BASE_URL}/jobs/${country}/search/${page}`,
            {
                params: {
                    app_id: process.env.ADZUNA_API_ID,
                    app_key: process.env.ADZUNA_API_KEY,

                    what: query,

                    ...(location && {
                        where: location
                    }),

                    results_per_page: resultsPerPage,

                    sort_by : "date",

                    max_days_old : 30,

                    "content-type": "application/json"
                },

                headers: {
                    Accept: "application/json"
                }
            }
        );


        return response.data;

    } catch (error) {

        console.error(
            "Adzuna API error:",
            error.response?.data || error.message
        );

        throw new Error(
            "Failed to fetch jobs from Adzuna"
        );
    }
};


export default searchJobs;