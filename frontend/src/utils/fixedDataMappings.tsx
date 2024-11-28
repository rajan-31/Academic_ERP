import StudentData from "../types/StudentTypes";

export const domainsList = [
    { label: "M. Tech. CSE", value: 1 },
    { label: "M. Tech. ECE", value: 2 },
    { label: "I. M. Tech. CSE", value: 3 },
    { label: "I. M. Tech. ECE", value: 4 },
    { label: "M. S. CSE", value: 5 },
    { label: "M. S. ECE", value: 6 },
];

export const domainsStringsList = [
    { label: "M. Tech. CSE", value: "1" },
    { label: "M. Tech. ECE", value: "2" },
    { label: "I. M. Tech. CSE", value: "3" },
    { label: "I. M. Tech. ECE", value: "4" },
    { label: "M. S. CSE", value: "5" },
    { label: "M. S. ECE", value: "6" },
];

export const specializationList = [
    { label: "Artificial Intelligence and Machine Learning", value: 1 },
    { label: "Theoretical Computer Science", value: 2 },
    { label: "Software Systems", value: 3 },
    { label: "Networking and Communication", value: 4 },
    { label: "VLSI Systems", value: 5 },
    { label: "Digital Society", value: 6 }
];

export const keyLabelPairs: { key: keyof StudentData, label: string }[] = [
    { key: "roll_number", label: "Roll Number" },
    { key: "email", label: "Email" },
    { key: "domain", label: "Domain" },
    { key: "specialization", label: "Specialization" },
    { key: "cgpa", label: "CGPA" },
    { key: "total_credits", label: "Total Credits" },
    { key: "graduation_year", label: "Graduation Year" }
];

export const toDomainName = (domainCode: number) => {
    const domain = domainsList.find(domain => domain.value === domainCode);
    return domain ? domain.label : "";
};

export const toSpecializationName = (specializationCode: number) => {
    const specialization = specializationList.find(specialization => specialization.value === specializationCode);
    return specialization ? specialization.label : "";
};