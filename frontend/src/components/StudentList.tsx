import StudentData from "../types/StudentTypes";
import StudentListItem from "./StudentListItem";

const StudentList = ({studentList}: {studentList: [StudentData] | []}) => {
    return (
        <div>
            {studentList.map((item, i) => (
                <StudentListItem studentDetails={item} key={i} />
            ))}
        </div>
    )
}

export default StudentList;