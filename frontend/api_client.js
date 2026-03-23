const API_BASE = "http://localhost:5000/api";

const apiClient = {
    async post(endpoint, data, isFormData = false) {
        const token = localStorage.getItem("token");
        const headers = {};
        if (!isFormData) headers["Content-Type"] = "application/json";
        if (token) headers["Authorization"] = `Bearer ${token}`;

        try {
            const response = await fetch(`${API_BASE}${endpoint}`, {
                method: "POST",
                headers: headers,
                body: isFormData ? data : JSON.stringify(data)
            });

            if (!response.ok) {
                const errData = await response.json();
                console.error(`API Error [${response.status}]:`, errData);
                return { success: false, error: errData.error || "Server error" };
            }

            return await response.json();
        } catch (err) {
            console.error("Fetch Failure:", err);
            throw err;
        }
    },

    async get(endpoint) {
        const token = localStorage.getItem("token");
        const headers = token ? { "Authorization": `Bearer ${token}` } : {};
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: "GET",
            headers: headers
        });
        return response.json();
    },

    async put(endpoint, data, isFormData = false) {
        const token = localStorage.getItem("token");
        const headers = {};
        if (!isFormData) headers["Content-Type"] = "application/json";
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: "PUT",
            headers: headers,
            body: isFormData ? data : JSON.stringify(data)
        });
        return response.json();
    }
};
