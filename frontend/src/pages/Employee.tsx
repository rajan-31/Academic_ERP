import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentList from "../components/StudentList";
import StudentData from "../types/StudentTypes";

const Employee = () => {
    const [firstName, setFristName] = useState("John");
    const [lastName, setLastName] = useState("Doe");
    const [domain, setDomain] = useState("1");
    const [photograph, setPhotograph] = useState<File | null>(null);

    const [newStudent, setNewStudent] = useState("");

    const [studentListData, setStudentListData] = useState<[StudentData] | []>([]);

    const domainsList = ["M. Tech. CSE", "M. Tech. ECE", "I. M. Tech. CSE", "I. M. Tech. ECE", "M. S. CSE", "M. S. ECE"];

    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png'];
      
            if (!allowedTypes.includes(file.type)) {
                alert('Please select a JPG or PNG file.');
                return;
            }

            setPhotograph(file);
        }
    }

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const jwtToken = localStorage.getItem("jwtToken");

            const formData = new FormData();

            // Append the JSON object directly
            const jsonData = {
                first_name: firstName,
                last_name: lastName,
                domain: domain
            };

            // Use a Blob to maintain the correct `Content-Type` for JSON
            formData.append("data", new Blob([JSON.stringify(jsonData)], { type: "application/json" }));

            if(photograph)
                formData.append("photograph", photograph);

            // Send the request
            const res = await axios.post("/students", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": "Bearer " + jwtToken
                }
            });

            const data: {
                "student_id": string,
                "roll_number": string,
                "first_name": string,
                "last_name": string,
                "email": string,
                "photograph_path": string,
                "domain": number
            } = res.data;

            setNewStudent(JSON.stringify(data, null, 4))
        } catch (error) {
            alert("Failed to admit student");
        }
    }

    useEffect(() => {
        const fetchStudentList = async () => {
            try {
                const jwtToken = localStorage.getItem("jwtToken");

                const res = await axios.get("/students", {
                    headers: {
                        "Authorization": "Bearer " + jwtToken
                    }
                });
                const data: [StudentData] | [] = res.data? res.data : [];

                setStudentListData(data);
            } catch (error) {
                navigate("/login");
            }
        }

        fetchStudentList();
    }, []);
    
    return (
        <div>
            <h1>Admit New Student</h1>

            <form onSubmit={handleFormSubmit}>
                <input type="text" value={firstName} placeholder="First Name" required
                    className="rounded border-2 border-indigo-500"
                    onChange={e => setFristName(e.target.value)}
                />
                <input type="text" value={lastName} placeholder="Last Name" required
                    className="rounded border-2 border-indigo-500"
                    onChange={e => setLastName(e.target.value)}
                />
                <select value={domain} onChange={e => setDomain(e.target.value)} required>
                    <option>Select a domain</option>
                    {domainsList.map((item, i) => (
                        <option key={i} value={i+1}>{item}</option>
                    ))}
                </select>
                <input type="file" accept="image/png, image/jpeg" onChange={handleFileChange}/>

                <button type="submit" className="bg-emerald-500">Admit</button>
            </form>

            {newStudent &&
            <pre>
                <code>{newStudent}</code>
            </pre>
            }

            <h1>Student List</h1>
            <StudentList studentList={studentListData} />

        </div>
    );
}

export default Employee;