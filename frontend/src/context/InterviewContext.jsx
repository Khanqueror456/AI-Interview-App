import { createContext, useState } from "react";
import { getInterview } from "../services/interviewService";
import toast from "react-hot-toast";

const InterviewContext = createContext();

export const InterviewProvider = ({children}) => {

    const [interview, setInterview] = useState({});

    const getInterviewById = async (id) => {

        try {
            
            const response = await getInterview(id);
            setInterview(response);

        } catch (error) {
            
            console.log(error.message || "Unable to fetch interview");
        }

    }

    const updateInterviewById = async (id, data) => {

        const reponse = updateInterview
    }

    return (

        <InterviewContext.Provider>

            {children}

        </InterviewContext.Provider>
    )

}

export default InterviewContext;

