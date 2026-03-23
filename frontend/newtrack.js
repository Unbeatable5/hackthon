async function checkStatus(paramId = null) {
    const id = paramId || document.getElementById("complaintId").value.trim();
    if (!id) {
        alert("Please enter a Complaint ID");
        return;
    }

    const token = localStorage.getItem("token");
    const headers = token ? { "Authorization": `Bearer ${token}` } : {};
    const url = token ? `http://localhost:5000/api/complaints/${id}` : `http://localhost:5000/api/complaints/track/${id}`;

    try {
        const response = await fetch(url, { headers });
        
        if (!response.ok) {
            alert("Complaint ID not found or Access Denied");
            return;
        }

        const c = await response.json();

        // Show card and update fields
        document.getElementById("resultCard").style.display = "block";
        document.getElementById("f-id").textContent = c.complaintId;
        document.getElementById("f-priority").textContent = c.priority.toUpperCase();
        document.getElementById("f-title").textContent = c.title || "Civic Issue";
        document.getElementById("f-category").textContent = c.category.toUpperCase();
        document.getElementById("f-area").textContent = c.area || "City Wide";
        document.getElementById("f-date").textContent = new Date(c.submittedAt).toLocaleDateString();
        document.getElementById("f-deadline").textContent = c.deadline ? new Date(c.deadline).toLocaleDateString() : "PENDING";
        document.getElementById("f-status").textContent = c.status.toUpperCase().replace('_', ' ');
        document.getElementById("f-dept").textContent = (c.assignedDept || 'General').toUpperCase();
        document.getElementById("f-desc").textContent = c.description;

        // Citizen Info (if available)
        const citizenBox = document.getElementById("citizen-info");
        if (c.citizen) {
            citizenBox.style.display = "block";
            document.getElementById("f-citizen-name").textContent = c.citizen.name || "N/A";
            document.getElementById("f-citizen-contact").textContent = c.citizen.phone || c.citizen.email || "N/A";
        } else {
            citizenBox.style.display = "none";
        }


        // Stepper logic - improved mapping
        const statusSteps = { "pending": 1, "viewed": 2, "in_progress": 3, "resolved": 4, "delayed": 3, "escalated": 3 };
        const currentStep = statusSteps[c.status] || 1;


        const boxes = document.querySelectorAll('.step-box');
        const lines = document.querySelectorAll('.step-line');
        
        boxes.forEach((b, i) => {
            if (i < currentStep) b.classList.add('active');
            else b.classList.remove('active');
        });

        lines.forEach((l, i) => {
            if (i < currentStep - 1) l.classList.add('active-line');
            else l.classList.remove('active-line');
        });

        // Evidence and Messages
        if (c.images && c.images.length > 0) {
            document.querySelector("#citizen-evidence img").src = `http://localhost:5000/uploads/${c.images[0]}`;
        }

        const msgBox = document.getElementById("f-message");
        if (c.status !== 'pending' && c.departmentMessage) {
            msgBox.style.display = "block";
            document.getElementById("f-msg-text").textContent = c.departmentMessage;
        } else {
            msgBox.style.display = "none";
        }

        const proofBox = document.getElementById("f-proof");
        if (c.status === 'resolved') {
            proofBox.style.display = "block";
            if (c.resolvedImages && c.resolvedImages.length > 0) {
                document.querySelector("#f-proof img").src = `http://localhost:5000/uploads/${c.resolvedImages[0]}`;
            }
        } else {
            proofBox.style.display = "none";
        }

        // SLA
        const slaBadge = document.querySelector(".sla-badge");
        if (c.slaBreached) {
            slaBadge.style.display = "flex";
        } else {
            slaBadge.style.display = "none";
        }

    } catch (error) {
        console.error(error);
        alert("Server connection failed.");
    }
}

window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
        document.getElementById("complaintId").value = id;
        checkStatus(id);
    }
};

function goHome() {
    window.location.href = "index.html";
}