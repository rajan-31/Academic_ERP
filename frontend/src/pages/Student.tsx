import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type StudentData = {
    placement: number,
    student_id: number,
    roll_number: string,
    first_name: string,
    last_name: string,
    email: string,
    photograph_path: string,
    cgpa: number,
    total_credits: number,
    graduation_year: number,
    domain: number,
    specialization: number
};

const Student = () => {
    const [studentData, setStudentData] = useState< StudentData | null>(null);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [photograph, setPhotograph] = useState<File | null>(null);

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
        if(!studentData) {
            alert("Something went wrong!");
            return;
        }

        setFirstName(firstName.trim());
        setLastName(lastName.trim());

        try {
            const jwtToken = localStorage.getItem("jwtToken");

            let modifiedDataPresent: boolean = false;

            const formData = new FormData();

            // Append the JSON object directly
            const jsonData: {
                first_name?: string,
                last_name?: string
            } = {};
            if(firstName && firstName.trim() !== studentData.first_name) jsonData.first_name = firstName;
            if(lastName && lastName.trim() !== studentData.last_name) jsonData.last_name = lastName;

            // Use a Blob to maintain the correct `Content-Type` for JSON
            if(jsonData.first_name || jsonData.last_name) {
                formData.append("data", new Blob([JSON.stringify(jsonData)], { type: "application/json" }));
                modifiedDataPresent = true;
            }

            if(photograph) {
                formData.append("photograph", photograph);
                modifiedDataPresent = true;
            }

            if(!modifiedDataPresent){
                alert("Nothing has beed modified!");
                return;
            }

            // Send the request
            const res = await axios.put("/students" + `/${studentData.student_id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": "Bearer " + jwtToken
                }
            });

            const data: StudentData = res.data;

            setStudentData(data);

            alert("Updated successfully!")
        } catch (error) {
            alert("Failed to update");
            navigate("/login");
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jwtToken = localStorage.getItem("jwtToken");
    
                const res = await axios.get("/students/email", {
                    headers: {
                        "Authorization": "Bearer " + jwtToken
                    }
                });
                const data: StudentData | null = res.data
    
                setStudentData(data);
                setFirstName(data ? data.first_name : "");
                setLastName(data ? data.last_name : "");
            } catch (error) {
                navigate("/login");
            }
        }

        fetchData();
    }, []);

    return (
        <div>
            <h1>Student</h1>

            { studentData &&
                <div>
                    <pre>
                        <code>{JSON.stringify(studentData, null, 4)}</code>
                    </pre>

                    <img src={`http://localhost:8080${studentData.photograph_path}`} width="100" />
                </div>
            }

            <form onSubmit={handleFormSubmit}>
                <input type="text" value={firstName} placeholder="First Name" required
                    className="rounded border-2 border-indigo-500 capitalize"
                    onChange={e => setFirstName(e.target.value.toLowerCase())}
                />
                <input type="text" value={lastName} placeholder="Last Name" required
                    className="rounded border-2 border-indigo-500 capitalize"
                    onChange={e => setLastName(e.target.value.toLowerCase())}
                />                

                <input type="file" accept="image/png, image/jpeg" onChange={handleFileChange}/>

                <button type="submit" className="bg-emerald-500">Update</button>
            </form>
        </div>
    );
}

export default Student;