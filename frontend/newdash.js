// newdash.js
document.addEventListener("DOMContentLoaded", () => {
    loadComplaintDetail();
});

async function loadComplaintDetail() {
    const id = localStorage.getItem("currentComplaintId");
    if (!id) {
        window.location.href = "dash.html";
        return;
    }

    try {
        const c = await apiClient.get(`/authority/complaints/${id}`);
        if (c.error) {
            alert("Error: " + c.error);
            return;
        }

        // Fill data
        document.getElementById("f-complaintId").innerText = c.complaintId;
        document.getElementById("f-priority").innerText = c.priority.charAt(0).toUpperCase() + c.priority.slice(1);
        document.getElementById("f-category").innerText = c.category.charAt(0).toUpperCase() + c.category.slice(1);
        document.getElementById("f-date").innerText = new Date(c.submittedAt).toLocaleDateString();

        document.getElementById("descText").innerText = c.description;

        // Citizen Info (Phone/Email)
        const citizenInfo = document.querySelector(".citizen-info");
        if (citizenInfo && c.citizen) {
            citizenInfo.innerHTML = `<span class="material-icons-outlined" style="font-size:14px; vertical-align:middle;">call</span> ${c.citizen.phone || c.citizen.email || 'N/A'}`;
        }
        
        // Image
        if (c.images && c.images.length > 0) {
            document.getElementById("complaintImage").src = `http://localhost:5000/uploads/${c.images[0]}`;
        } else {
            document.getElementById("complaintImage").src = "https://via.placeholder.com/400?text=No+Image+Provided";
        }

        // Stepper Status Logic
        const statusSteps = { "pending": 1, "viewed": 2, "in_progress": 3, "resolved": 4 };
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


        // Action fields
        document.getElementById("statusSelect").value = c.status;
        document.getElementById("citizenMessage").value = c.departmentMessage || "";
        if (c.deadline) {
            document.querySelector("input[type='date']").value = new Date(c.deadline).toISOString().split('T')[0];
        }

    } catch (error) {
        console.error("Failed to load complaint:", error);
    }
}

async function saveStatus() {
    const id = localStorage.getItem("currentComplaintId");
    const status = document.getElementById("statusSelect").value;
    const departmentMessage = document.getElementById("citizenMessage").value;
    const deadline = document.querySelector("input[type='date']").value;
    const proofFile = document.getElementById("proofFileInput").files[0];

    const formData = new FormData();
    formData.append("status", status);
    formData.append("departmentMessage", departmentMessage);
    formData.append("deadline", deadline);
    if (proofFile) formData.append("resolvedImages", proofFile);

    try {
        const result = await apiClient.put(`/authority/complaints/${id}`, formData, true);
        
        if (result.success || !result.error) {
            document.getElementById('savePopupOverlay').style.display = 'flex';
        } else {
            alert("Update failed: " + result.error);
        }
    } catch (error) {
        console.error(error);
        alert("Server error during update.");
    }
}


function confirmSave() {
    // Already handled in saveStatus with popup
    window.location.href = "dash.html";
}

function closePopup() {
    document.getElementById('savePopupOverlay').style.display = 'none';
    window.location.href = "dash.html";
}

function downloadImage() {
    const img = document.getElementById('complaintImage');
    window.open(img.src, '_blank');
}

function toggleMessageInput() {
    const msgGroup = document.getElementById('messageInputGroup');
    msgGroup.style.display = msgGroup.style.display === 'none' ? 'block' : 'none';
}

function toggleUploadInput() {
    const statusSelect = document.getElementById('statusSelect');
    const uploadGroup = document.getElementById('uploadProofGroup');
    if (statusSelect && uploadGroup) {
        uploadGroup.style.display = statusSelect.value.toLowerCase() === 'resolved' ? 'block' : 'none';
    }
}