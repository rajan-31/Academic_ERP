import { Button } from "primereact/button";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileImage } from "../components/Student/ProfileImage";

import StudentData from "../types/StudentTypes";
import { keyLabelPairs, toDomainName, toSpecializationName } from "../utils/fixedDataMappings";
import { getStudentByEmail, updateStudentById } from "../utils/httpUtils";


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


            const data: StudentData = await updateStudentById(studentData.student_id, formData);

            setStudentData(data);
            setImageSrc(data.photograph_path);
            toastRef.current.show({ severity: 'success', summary: 'Success', detail: 'Details updated successfully!' });

            fileUploadRef.current.clear();
        } catch (error: any) {
            if(error.status === 401)
                navigate("/login");
            if(error.status === 400)
                toastRef.current.show({ severity: 'error', summary: 'Error', detail: 'Invalid data!' });
            else
                toastRef.current.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
        }

        setIsLoadingmodify(false);
    }

    const fetchData = async () => {
        try {
            
            const data: StudentData | null = await getStudentByEmail();

            if(data) {
                setStudentData(data);
                setFirstName(data.first_name);
                setLastName(data.last_name);
                setImageSrc(data.photograph_path ? `${process.env.REACT_APP_API_DOMAIN}${data.photograph_path}` : "")
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
        <div className="main-container flex flex-col">
            <Toast ref={toastRef} className="mt-20" />
            <div className="flex-1">
                <div className="text-3xl text-center mt-5 mb-4 font-bold text-blue-600 capitalize">
                    {studentData ? studentData.first_name + " " + studentData.last_name : ""}
                </div>

                <ProfileImage imageSrc={imageSrc} setImageSrc={setImageSrc} />

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
        </div>
    );
}

export default Student;