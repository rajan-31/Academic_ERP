import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import StudentData from "../types/StudentTypes";

const StudentDetails = () => {
    const {state}: {state: StudentData} = useLocation();
    const [studentData, setStudentData] = useState<StudentData>(state);

    const [firstName, setFristName] = useState(studentData.first_name);
    const [lastName, setLastName] = useState(studentData.last_name);
    const [domain, setDomain] = useState(String(studentData.domain));
    const [photograph, setPhotograph] = useState<File | null>(null);

    const [emailModify, setEmailModify] = useState(false);
    const [rollNumberModify, setRollNumberModify] = useState(false);
    const [cgpa, setCgpa] = useState(studentData.cgpa ? String(studentData.cgpa) : "");
    const [totalCredits, setTotlCredits] = useState(studentData.total_credits ? String(studentData.total_credits) : "");
    const [graduationYear, setGraduationYear] = useState(studentData.graduation_year ? String(studentData.graduation_year) : "");
    const [specialization, setSpecialization] = useState(studentData.specialization ? String(studentData.specialization) : "");

    const domainsList = ["M. Tech. CSE", "M. Tech. ECE", "I. M. Tech. CSE", "I. M. Tech. ECE", "M. S. CSE", "M. S. ECE"];
    const specializationList = ["Artificial Intelligence and Machine Learning", "Theoretical Computer Science", "Software Systems", "Networking and Communication", "VLSI Systems", "Digital Society"];

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

            let modifiedDataPresent: boolean = false;

            const formData = new FormData();

            // Append the JSON object directly
            const jsonData: {
                first_name?: string,
                last_name?: string,
                domain?: string,
                email_modify?: boolean,
                roll_number_modify?: boolean,
                cgpa?: string,
                total_credits?: string,
                graduation_year?: string,
                specialization?: string
            } = {};

            if(firstName && firstName.trim() !== studentData.first_name) jsonData.first_name = firstName;
            if(lastName && lastName.trim() !== studentData.last_name) jsonData.last_name = lastName;
            if(domain && domain !== String(studentData.domain)) jsonData.domain = domain;
            if(emailModify) jsonData.email_modify = true;
            if(rollNumberModify) jsonData.email_modify = true;
            if(cgpa && cgpa !== String(studentData.cgpa)) jsonData.cgpa = cgpa;
            if(totalCredits && totalCredits !== String(studentData.total_credits)) jsonData.total_credits = totalCredits;
            if(graduationYear && graduationYear !== String(studentData.graduation_year)) jsonData.graduation_year = graduationYear;
            if(specialization && specialization !== String(studentData.specialization)) jsonData.specialization = specialization;

            if(Object.keys(jsonData).length > 0) {
                formData.append("data", new Blob([JSON.stringify(jsonData)], { type: "application/json" }));
                modifiedDataPresent = true;
            }            

            if(photograph){
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

            alert("Updated successfully!");
        } catch (error) {
            alert("Failed to update student");
        }
    }

    return (
        <div>
            { state &&
                <div>
                    <pre>
                        <code>{JSON.stringify(studentData, null, 4)}</code>
                    </pre>
    
                    <img src={`http://localhost:8080${state.photograph_path}`} width="100" />
                </div>
            }
            
            <form onSubmit={handleFormSubmit}>
                <input type="text" value={firstName} placeholder="First Name"
                    className="rounded border-2 border-indigo-500"
                    onChange={e => setFristName(e.target.value)}
                />
                <input type="text" value={lastName} placeholder="Last Name"
                    className="rounded border-2 border-indigo-500"
                    onChange={e => setLastName(e.target.value)}
                />
                <select value={domain} onChange={e => setDomain(e.target.value)}>
                    <option>Select a domain</option>
                    {domainsList.map((item, i) => (
                        <option key={i} value={i+1}>{item}</option>
                    ))}
                </select>
                <input type="file" accept="image/png, image/jpeg" onChange={handleFileChange}/>

                <div>
                    <label htmlFor="email_modify">Generate New Email</label>
                    <input type="checkbox" id="email_modify" checked={emailModify} onChange={(e) => setEmailModify(e.target.checked)}/>
                </div>
                <div>
                    <label htmlFor="roll_number_modify">Generate New Roll Number</label>
                    <input type="checkbox" id="roll_number_modify" checked={rollNumberModify} onChange={(e) => setRollNumberModify(e.target.checked)}/>
                </div>
                <div>
                    <input type="number" min="0" max="4" step="0.01" value={cgpa} placeholder="CGPA"
                        className="rounded border-2 border-indigo-500"
                        onChange={e => setCgpa(e.target.value)}
                    />
                    <input type="number" min="0" step="1" value={totalCredits} placeholder="Total Credits"
                        className="rounded border-2 border-indigo-500"
                        onChange={e => setTotlCredits(e.target.value)}
                    />
                    <input type="number" min="1900" step="1" value={graduationYear} placeholder="Graduation Year"
                        className="rounded border-2 border-indigo-500"
                        onChange={e => setGraduationYear(e.target.value)}
                    />
                </div>
                <div>
                    <select value={specialization} onChange={e => setSpecialization(e.target.value)}>
                        <option>Select a specialization</option>
                        {specializationList.map((item, i) => (
                            <option key={i} value={i+1}>{item}</option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="bg-emerald-500">Update</button>
            </form>
        </div>
    )
}

export default StudentDetails;