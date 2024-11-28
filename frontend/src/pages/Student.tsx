import axios from "axios";
import { Button } from "primereact/button";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
import { Image } from "primereact/image";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
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

    const [imageSrc, setImageSrc] = useState("");

    const [isLoadingModify, setIsLoadingmodify] = useState(false);

    const navigate = useNavigate();
    const fileUploadRef = useRef<any>(null);
    const toastRef = useRef<any>(null);

    const keyLabelPairs: { key: keyof StudentData, label: string }[] = [
        { key: "roll_number", label: "Roll Number" },
        { key: "email", label: "Email" },
        { key: "domain", label: "Domain" },
        { key: "specialization", label: "Specialization" },
        { key: "cgpa", label: "CGPA" },
        { key: "total_credits", label: "Total Credits" },
        { key: "graduation_year", label: "Graduation Year" }
    ];

    const domainsList = [
        { label: "M. Tech. CSE", value: 1 },
        { label: "M. Tech. ECE", value: 2 },
        { label: "I. M. Tech. CSE", value: 3 },
        { label: "I. M. Tech. ECE", value: 4 },
        { label: "M. S. CSE", value: 5 },
        { label: "M. S. ECE", value: 6 },
    ];

    const toDomainName = (domainCode: number) => {
        const domain = domainsList.find(domain => domain.value === domainCode);
        return domain ? domain.label : "Unknown";
    };

    const specializationList = [
        { label: "Artificial Intelligence and Machine Learning", value: 1 },
        { label: "Theoretical Computer Science", value: 2 },
        { label: "Software Systems", value: 3 },
        { label: "Networking and Communication", value: 4 },
        { label: "VLSI Systems", value: 5 },
        { label: "Digital Society", value: 6 }
    ];

    const toSpecializationName = (specializationCode: number) => {
        const specialization = specializationList.find(specialization => specialization.value === specializationCode);
        return specialization ? specialization.label : "Unknown";
    };

    const handleFileChange = (e: FileUploadSelectEvent) => {
        const file = e.files[0];

        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png'];
      
            if (!allowedTypes.includes(file.type)) {
                toastRef.current.show({ severity: 'error', summary: 'Error', detail: 'Only JPG or PNG files are allowed.' });
                fileUploadRef.current.clear();
                setPhotograph(null);
                return;
            }

            setPhotograph(file);
        } else {
            setPhotograph(null);
        }
    }

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoadingmodify(true);

        if(!studentData) {
            toastRef.current.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
            setIsLoadingmodify(false);
            return;
        }

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
                toastRef.current.show({ severity: 'info', summary: 'Error', detail: 'Nothing has beed modified!' });
                setIsLoadingmodify(false);
                return;
            }

            // Send the request
            const res = await axios.put(`/students/${studentData.student_id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": "Bearer " + jwtToken
                }
            });

            const data: StudentData = res.data;

            setStudentData(data);
            setImageSrc(data.photograph_path);
            toastRef.current.show({ severity: 'success', summary: 'Success', detail: 'Details updated successfully!' });

            fileUploadRef.current.clear();
        } catch (error) {
            alert("Something went wrong, logging you out.");
            navigate("/login");
        }

        setIsLoadingmodify(false);
    }

    const fetchData = async () => {
        try {
            const jwtToken = localStorage.getItem("jwtToken");

            const res = await axios.get("/students/email", {
                headers: {
                    "Authorization": "Bearer " + jwtToken
                }
            });
            const data: StudentData | null = res.data

            if(data) {
                setStudentData(data);
                setFirstName(data.first_name);
                setLastName(data.last_name);
                setImageSrc(data.photograph_path ? `http://localhost:8080${data.photograph_path}` : "")
            }
        } catch (error) {
            navigate("/login");
        }
    }

    useEffect(() => {
        fetchData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{height: "calc(100vh - 62px)"}} className="flex flex-col">
            <Toast ref={toastRef} className="mt-20" />
            <div className="flex-1">
                <div className="text-3xl text-center mt-5 mb-4 font-bold text-blue-600 capitalize">
                    {studentData ? studentData.first_name + " " + studentData.last_name : ""}
                </div>

                <div className="mb-5 flex justify-center">
                    <Image src={imageSrc} alt="Profile" 
                        height="200"
                        preview={true}
                        pt={{
                            root: {className: "flex justify-center rounded-full overflow-hidden shadow-xl shadow-blue-500/50 w-[200px] h-[200px]"},
                        }}
                        closeOnEscape={true}
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            setImageSrc("/images/user_placeholder.png");
                        }}
                    />
                </div>

                <form onSubmit={handleFormSubmit} className="max-w-[700px] mx-auto px-3 mb-16">
                    <div className="flex gap-2 flex-wrap">
                        <div className="flex-1 flex flex-column gap-2 mb-3">
                            <label htmlFor="first_name" className="font-bold">First Name</label>
                            <InputText type="text" value={firstName} keyfilter="alpha" id="first_name"
                                className="capitalize"
                                placeholder="First Name"
                                onChange={(e) => setFirstName(e.target.value)}
                                maxLength={40}
                            />
                        </div>
                        <div className="flex-1 flex flex-column gap-2 mb-3">
                            <label htmlFor="last_name" className="font-bold">Last Name</label>
                            <InputText type="text" value={lastName} keyfilter="alpha" id="last_name"
                                className="capitalize"
                                placeholder="Last Name"
                                onChange={(e) => setLastName(e.target.value)} 
                                maxLength={40}
                            />
                        </div>
                    </div>

                    <div className="flex flex-column gap-2 mb-4">
                        <label htmlFor="photograph" className="font-bold">Photograph</label>
                        <FileUpload id="photograph"  accept="image/png, image/jpeg" 
                            ref={fileUploadRef}
                            multiple={false} maxFileSize={1000000}
                            onSelect={handleFileChange} 
                            onClear={() => setPhotograph(null)}
                            onRemove={() => setPhotograph(null)}
                            uploadOptions= {{className: "hidden"}}
                            pt={{
                                badge: {root: {className: "hidden"}},
                                buttonbar: {className: "justify-content-center"},
                            }}
                            chooseOptions={{icon: "pi pi-image"}}
                        />
                    </div>

                    <Button type="submit" label="Modify"
                        raised icon="pi pi-user-edit" 
                        loading={isLoadingModify}
                        className="w-full mb-3"
                        pt={{
                            icon: {className: "mr-auto"}
                        }}
                    />
                </form>

                <div className="max-w-[700px] mx-auto px-3 mb-24">
                    <div className="p-3 border-1 border-gray-200 rounded-2xl hover:shadow-lg">
                        <div>
                            <div className="mb-2 text-base/7 font-semibold text-gray-900">More Information</div>
                            <div className="max-w-2xl text-sm/6 text-gray-500">Personal and academic details.</div>
                        </div>
                        <div className="mt-4">
                        {
                            keyLabelPairs.map((pair) => {
                                let value: any;
                                if(pair.key === "domain") {
                                    value = toDomainName(studentData ? studentData[pair.key] : -1);
                                } else if(pair.key === "specialization") {
                                    value = toSpecializationName(studentData ? studentData[pair.key] : -1)
                                } else {
                                    value = studentData ? studentData[pair.key] : "";
                                }
                                return (
                                <div key={pair.key} className="flex flex-wrap py-3 border-top-1 border-black/10">
                                    <div className="flex-1 min-w-[300px] text-sm/6 font-medium text-gray-900">{pair.label}</div>
                                    <div className="flex-1 min-w-[300px] text-sm/6 text-gray-700">{value}</div>
                                </div>
                                )
                        })
                        }
                        </div>
                    </div>
                </div>
            </div>










            {/* { studentData &&
                <div>
                    <pre>
                        <code>{JSON.stringify(studentData, null, 4)}</code>
                    </pre>

                    <img src={`http://localhost:8080${studentData.photograph_path}`} width="100" alt="Profile" />
                </div>
            } */}

            {/* <form onSubmit={handleFormSubmit}>
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
            </form> */}
        </div>
    );
}

export default Student;