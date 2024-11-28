import axios from "axios";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { MenuItem } from "primereact/menuitem";
import { Message } from "primereact/message";
import { ProgressSpinner } from "primereact/progressspinner";
import { TabMenu } from "primereact/tabmenu";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentData from "../types/StudentTypes";

const Employee = () => {
    const [firstName, setFristName] = useState("john");
    const [lastName, setLastName] = useState("doe");
    const [domain, setDomain] = useState("1");
    const [photograph, setPhotograph] = useState<File | null>(null);

    const [studentListData, setStudentListData] = useState<[StudentData] | []>([]);

    const domainsList = [
        { label: "M. Tech. CSE", value: "1" },
        { label: "M. Tech. ECE", value: "2" },
        { label: "I. M. Tech. CSE", value: "3" },
        { label: "I. M. Tech. ECE", value: "4" },
        { label: "M. S. CSE", value: "5" },
        { label: "M. S. ECE", value: "6" },
    ];

    const navigate = useNavigate();

    const handleFileChange = (e: FileUploadSelectEvent) => {
        const file = e.files[0];

        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png'];
      
            if (!allowedTypes.includes(file.type)) {
                alert('Please select a JPG or PNG file.');
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
        setIsLoadingAdmit(true);
        try {
            const jwtToken = localStorage.getItem("jwtToken");

            const formData = new FormData();

            if(!domain){
                setErrorMessage("Please select a domain");
                setIsLoadingAdmit(false);
                return;
            }

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
            await axios.post("/students", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": "Bearer " + jwtToken
                }
            });

            setSuccessMessage("Student admitted successfully!");
            setErrorMessage("");
            fetchStudentList();
        } catch (error: any) {
            if(error.status === 400)
                setErrorMessage("Invalid data enetered");
            else
                setErrorMessage("Something went wrong");

            setSuccessMessage("");
        }
        setIsLoadingAdmit(false);
    }

    const fetchStudentList = async () => {
        setIsLoadingStudentList(true);
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
        setIsLoadingStudentList(false);
    }

    useEffect(() => {
        fetchStudentList();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    // =================================================
    const [activeTabIndex, setActiveTabIndex] = useState(0);

    const items: MenuItem[] = [
        { label: 'Dashboard', icon: 'pi pi-objects-column' },
        { label: 'Admission', icon: 'pi pi-graduation-cap' },
    ];

    const [isLoadingAdmit, setIsLoadingAdmit] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [isLoadingStudentList, setIsLoadingStudentList] = useState(false);

    const fileUploadRef = useRef<any>(null);

    const viewDetailsTemplate = (item: StudentData) => {
        return <Button icon="pi pi-eye"
            outlined rounded severity="info" 
            aria-label="User" 
            onClick={() => navigate(`/students/${item.student_id}`, {state: item})} 
        />;
    }

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text
        onClick={async () => await fetchStudentList()}    
    />;
    
    return (
        <div style={{height: "calc(100vh - 62px)"}} className="flex flex-col">
            <div>
                <TabMenu model={items} 
                    activeIndex={activeTabIndex} 
                    onTabChange={(e) => setActiveTabIndex(e.index)} 
                    pt={{
                        menu: {className: "justify-center"}
                    }}
                />
            </div>

            { activeTabIndex === 0 && 
            <>
            { isLoadingStudentList &&
                <div className="flex-1 flex justify-content-center align-items-center">
                    <ProgressSpinner className="w-16 h-16"/>
                </div>
            }
            { !isLoadingStudentList &&
                <div className="flex-1 px-10 my-5">
                    <div className="text-3xl text-center mb-12 font-bold text-blue-600">
                        <i className="pi pi-users mr-2 text-3xl"></i>
                        Admitted Students
                    </div>
                    
                    {/* <StudentList studentList={studentListData} /> */}
                    <DataTable value={studentListData}
                        // scrollHeight="750px"
                        // scrollable={true}
                        stripedRows={true}
                        resizableColumns={true}
                        showGridlines={true}
                        paginator rows={7}
                        paginatorLeft={paginatorLeft}
                        sortMode="multiple"
                    >
                        <Column field="student_id" header="Id" sortable={true}></Column>
                        <Column field="first_name" header="First Name" bodyClassName="capitalize" sortable={true}></Column>
                        <Column field="last_name" header="Last Name" bodyClassName="capitalize" sortable={true}></Column>
                        <Column field="email" header="Email" sortable={true}></Column>
                        <Column body={viewDetailsTemplate} bodyStyle={{textAlign: "center"}} style={{width: "90px"}}></Column>
                    </DataTable>
                </div>
            }
            </> 
            }
            { activeTabIndex === 1 &&
                <div className="flex-1">
                <div className="text-3xl text-center mt-5 mb-12 font-bold text-blue-600">
                    <i className="pi pi-id-card mr-2 text-3xl"></i>
                    New Student Details
                </div>

                <form onSubmit={handleFormSubmit} className="w-[350px] mx-auto">
                    <div className="flex flex-column gap-2 mb-3">
                        <label htmlFor="first_name" className="font-bold">First Name</label>
                        <InputText type="text" value={firstName} keyfilter="alpha" id="first_name" required={true}
                            className="capitalize"
                            placeholder="First Name"
                            onChange={(e) => setFristName(e.target.value)}
                            maxLength={40}
                        />
                    </div>
                    <div className="flex flex-column gap-2 mb-3">
                        <label htmlFor="last_name" className="font-bold">Last Name</label>
                        <InputText type="text" value={lastName} keyfilter="alpha" id="last_name" required={true}
                            className="capitalize"
                            placeholder="Last Name"
                            onChange={(e) => setLastName(e.target.value)} 
                            maxLength={40}

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
                    <Button type="submit" label="Admit"
                        raised icon="pi pi-plus" 
                        loading={isLoadingAdmit}
                        className="w-full mb-3"
                        pt={{
                            icon: {className: "mr-auto"}
                        }}
                    />

                    { errorMessage &&
                        <Message severity="error" text={errorMessage} className="w-full"/>
                    }
                    { successMessage &&
                        <Message severity="success" text={successMessage} className="w-full"/>
                    }
                </form>
                </div>
            }


            {/* <h1>Admit New Student</h1>

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
            <StudentList studentList={studentListData} /> */}

        </div>
    );
}

export default Employee;