import {  useNavigate } from "react-router-dom";
import StudentData from "../types/StudentTypes";

const StudentListItem = ({studentDetails}: {studentDetails: StudentData} ) => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate(`/students/${studentDetails.student_id}`, {state: studentDetails});
    }

    return (
        <div className="border-t border-black p-1">
            <button onClick={handleButtonClick} className="bg-cyan-500">Edit Details</button>
            <pre>
                <code>
                    {JSON.stringify(studentDetails, null, 4)}
                </code>
            </pre>

        </div>
    )
}

export default StudentListItem;