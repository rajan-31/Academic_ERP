import axios from "axios"

export const postLogin = async (data: { email: string, password: string }) => {
    try {
        const res = await axios.post("/auth/login", data);
        return res.data;
    } catch (error) {
        throw error;
    }
}

export const postRegister = async (data: { email: string, password: string }) => {
    try {
        const res = await axios.post("/auth/login", data);
        return res.data;
    } catch (error) {
        throw error;
    }
}

export const admitNewStudent = async (formData: FormData) => {
    try {
        const jwtToken = localStorage.getItem("jwtToken");

        const res = await axios.post("/students", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": "Bearer " + jwtToken
            }
        });

        return res.data;
    } catch (error) {
        throw error;
    }
}

export const getAllStudents = async () => {
    try {
        const jwtToken = localStorage.getItem("jwtToken");

        const res = await axios.get("/students", {
            headers: {
                "Authorization": "Bearer " + jwtToken
            }
        });

        return res.data;
    } catch (error) {
        throw error;
    }
}

export const getStudentById = async (studentId: string | undefined) => {
    try {
        const jwtToken = localStorage.getItem("jwtToken");

        const res = await axios.get(`/students/${studentId}`, {
            headers: {
                "Authorization": "Bearer " + jwtToken
            }
        });

        return res.data;
    } catch (error) {
        throw error;
    }
}

export const getStudentByEmail = async () => {
    try {
        const jwtToken = localStorage.getItem("jwtToken");

        const res = await axios.get("/students/email", {
            headers: {
                "Authorization": "Bearer " + jwtToken
            }
        });

        return res.data;
    } catch (error) {
        throw error;
    }
}

export const updateStudentById = async (studentId: string | number | undefined, formData: FormData) => {
    try {
        const jwtToken = localStorage.getItem("jwtToken");

        const res = await axios.put(`/students/${studentId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": "Bearer " + jwtToken
            }
        });

        return res.data;
    } catch (error) {
        throw error;
    }
}