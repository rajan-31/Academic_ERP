import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProfileImage } from "../components/Student/ProfileImage";
import StudentData from "../types/StudentTypes";
import { domainsList, specializationList } from "../utils/fixedDataMappings";
import { getStudentById, updateStudentById } from "../utils/httpUtils";

const StudentDetails = () => {
    const {studentId} = useParams();
    const [studentData, setStudentData] = useState<StudentData>();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [domain, setDomain] = useState<null | number>();
    const [photograph, setPhotograph] = useState<File | null>(null);

    const [emailModify, setEmailModify] = useState(false);
    const [rollNumberModify, setRollNumberModify] = useState(false);
    const [cgpa, setCgpa] = useState<null | number>();
    const [totalCredits, setTotalCredits] = useState<null | number>(null);
    const [graduationYear, setGraduationYear] = useState<null | number>();
    const [specialization, setSpecialization] = useState<null | number>();

    const [imageSrc, setImageSrc] = useState("");
    const [email, setEmail] = useState("");
    const [rollNumber, setRollNumber] = useState("");

    const [isLoadingModify, setIsLoadingmodify] = useState(false);

    const fileUploadRef = useRef<any>(null);
    const toastRef = useRef<any>(null);

    const navigate = useNavigate();

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

        if(graduationYear && (graduationYear < 2000 || graduationYear > 2100)) {
            toastRef.current.show({ severity: 'error', summary: 'Error', detail: 'Graduation year is invalid' });
            setIsLoadingmodify(false);
            return;
        }

        try {
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

            if(firstName && firstName.trim() !== studentData?.first_name) jsonData.first_name = firstName;
            if(lastName && lastName.trim() !== studentData?.last_name) jsonData.last_name = lastName;
            if(domain && domain !== studentData?.domain) jsonData.domain = String(domain);
            if(emailModify) jsonData.email_modify = true;
            if(rollNumberModify) jsonData.roll_number_modify = true;
            if(cgpa && cgpa !== studentData?.cgpa) jsonData.cgpa = String(cgpa);
            if(totalCredits && totalCredits !== studentData?.total_credits) jsonData.total_credits = String(totalCredits);
            if(graduationYear && graduationYear !== studentData?.graduation_year) jsonData.graduation_year = String(graduationYear);
            if(specialization && specialization !== studentData?.specialization) jsonData.specialization = String(specialization);

            if(Object.keys(jsonData).length > 0) {
                formData.append("data", new Blob([JSON.stringify(jsonData)], { type: "application/json" }));
                modifiedDataPresent = true;
            }            

            if(photograph){
                formData.append("photograph", photograph);
                modifiedDataPresent = true;
            }

            if(!modifiedDataPresent){
                setIsLoadingmodify(false);
                toastRef.current.show({ severity: 'info', summary: 'Info', detail: 'Nothing has been modified!' });
                return;
            }

            const data: StudentData = await updateStudentById(studentId, formData);

            setStudentData(data);
            toastRef.current.show({ severity: 'success', summary: 'Success', detail: 'Student details updated successfully!' });

            fetchData();
            
            fileUploadRef.current.clear();
            setPhotograph(null);
            setEmailModify(false);
            setRollNumberModify(false);
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
            const data: StudentData = await getStudentById(studentId);

            if (data) {
                setStudentData(data);
                setFirstName(data.first_name);
                setLastName(data.last_name);
                setDomain(data.domain);
                setCgpa(data.cgpa);
                setTotalCredits(data.total_credits);
                setGraduationYear(data.graduation_year);
                setSpecialization(data.specialization);
                setEmail(data.email);
                setRollNumber(data.roll_number);
                setImageSrc(`${process.env.REACT_APP_API_DOMAIN}${data.photograph_path}`)
            }
        } catch (error) {
            toastRef.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch student details' });
        }
    }

    useEffect(() => {
        fetchData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="main-container flex flex-col">
            <Toast ref={toastRef} className="mt-20" />
            <div className="flex-1">
                <div className="text-3xl text-center mt-5 mb-4 font-bold text-blue-600">
                    <i className="pi pi-id-card mr-2 text-3xl"></i>
                    Student Details
                </div>

                <ProfileImage imageSrc={imageSrc} setImageSrc={setImageSrc} />

                <form onSubmit={handleFormSubmit} className="max-w-[700px] mx-auto px-3 mb-20">
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

                    <div className="flex gap-2 flex-wrap mb-5">
                        <div className="flex-1 flex-col">
                            <div className="flex flex-column gap-2 mb-3">
                                <label htmlFor="roll_number" className="font-bold">Roll Number</label>
                                <div className="p-2 text-gray-600">{rollNumber}&nbsp;</div>
                            </div>
                            <div className="flex align-items-center gap-2 mb-3">
                                <Checkbox inputId="roll_number_modify" checked={rollNumberModify} onChange={(e) => setRollNumberModify(e.checked ? true : false)}/>
                                <label htmlFor="roll_number_modify">Assign New Roll Number</label>
                            </div>
                        </div>

                        <div className="flex-1 flex-col">
                            <div className="flex flex-column gap-2 mb-3">
                                <label htmlFor="email" className="font-bold">Email</label>
                                <div className="p-2 text-gray-600">{email}&nbsp;</div>
                            </div>
                            <div className="flex align-items-center gap-2 mb-3">
                                <Checkbox inputId="email_modify" checked={emailModify} onChange={(e) => setEmailModify(e.checked ? true : false)}/>
                                <label htmlFor="email_modify">Assign New Email</label>
                            </div>
                        </div>
                    </div>


                    <div className="flex flex-column gap-2 mb-6">
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

                    
                    <div className="flex flex-column gap-2 mb-3">
                        <label htmlFor="domain" className="font-bold">Domain</label>
                        <Dropdown id="domain" value={domain}
                            onChange={(e) => setDomain(e.value)} 
                            options={domainsList}
                            optionLabel="label" optionValue="value"
                            placeholder="Select a Domain" className="w-full"
                        />
                    </div>
                    <div className="flex flex-column gap-2 mb-3">
                        <label htmlFor="specialization" className="font-bold">Specialization</label>
                        <Dropdown id="specialization" value={specialization}
                            onChange={(e) => setSpecialization(e.value)} 
                            options={specializationList}
                            optionLabel="label" optionValue="value"
                            placeholder="Select a Specialization" className="w-full"
                            showClear={true}
                        />
                    </div>
                    

                    <div className="flex gap-2 flex-wrap">
                        <div className="flex-1 flex flex-column gap-2 mb-3">
                            <label htmlFor="cgpa" className="font-bold">CGPA</label>
                            <InputNumber value={cgpa} inputId="cgpa"
                                placeholder="CGPA"
                                onChange={(e) => setCgpa(e.value ? e.value : 0)}
                                min={0} max={4} step={0.01}
                                showButtons={true}
                            />
                        </div>
                        <div className="flex-1 flex flex-column gap-2 mb-3">
                            <label htmlFor="credits" className="font-bold">Total Credits</label>
                            <InputNumber value={totalCredits} inputId="credits"
                                placeholder="Total Credits"
                                onChange={(e) => setTotalCredits(e.value ? e.value : 0)}
                                min={0} max={500} step={1}
                                showButtons={true}
                            />
                        </div>
                    </div>

                    <div className="flex flex-column gap-2 mb-5">
                        <label htmlFor="graduation-year" className="font-bold">Graduation Year</label>
                        <InputNumber value={graduationYear} inputId="graduation-year"
                            placeholder="Graduation Year"
                            onChange={(e) => setGraduationYear(e.value ? e.value : 0)}
                            min={0} max={2100} step={1}
                            showButtons={true} useGrouping={false}
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
            </div>
        </div>
    )
}

export default StudentDetails;