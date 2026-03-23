// submit.js - REBUILT FROM SCRATCH FOR HACKATHON STABILITY
let currentStep = 0;

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in to submit a complaint.");
        window.location.href = "verify.html";
    }
    loadHistory();
});

async function loadHistory() {
    const container = document.getElementById("historyList");
    if (!container) return;
    try {
        const complaints = await apiClient.get("/complaints/me");
        if (!complaints || complaints.length === 0) {
            container.innerHTML = `<p style="color:#94a3b8; font-size:0.85rem; text-align:center; padding:20px;">No complaints submitted yet.</p>`;
            return;
        }
        container.innerHTML = complaints.map(c => `
            <div class="card">
                <p><b>${c.category.charAt(0).toUpperCase() + c.category.slice(1)} Issue</b> <button onclick="location.href='newtrack.html?id=${c.complaintId}'">View</button></p>
                <p>Date: ${new Date(c.submittedAt).toLocaleDateString()}</p>
                <p class="status">${c.status.replace('_',' ')}</p>
            </div>
        `).join("");
    } catch (e) {
        console.error("Failed to load history", e);
    }
}


/**
 * Multi-stage AI Loading Simulation
 */
async function simulateAIThinking(callback) {
    const screen = document.getElementById("aiLoadingScreen");
    const title = document.getElementById("aiStatusTitle");
    const detail = document.getElementById("aiStatusDetail");
    const bar = document.getElementById("aiProgressBar");

    screen.style.display = "flex";
    
    const stages = [
        { progress: 10, title: "CivicSense AI", detail: "Initializing neural classification..." },
        { progress: 30, title: "Analyzing Content", detail: "Running semantic decomposition..." },
        { progress: 60, title: "Pattern Matching", detail: "Validating against historical city logs..." },
        { progress: 85, title: "Routing Algorithm", detail: "Determining optimal department assignment..." },
        { progress: 100, title: "Finalizing", detail: "Generating AI confidence metrics..." }
    ];

    for (const stage of stages) {
        title.innerText = stage.title;
        detail.innerText = stage.detail;
        bar.style.width = `${stage.progress}%`;
        // Random delay between 600ms and 1500ms per stage for "realistic" feel
        const delay = Math.floor(Math.random() * 900) + 600;
        await new Promise(r => setTimeout(r, delay));
    }

    // Call the actual AI prediction logic
    const aiResult = await callback();
    
    // Smooth transition out
    setTimeout(() => {
        screen.style.display = "none";
        bar.style.width = "0%";
    }, 400);

    return aiResult;
}

/**
 * Step 1: Trigger AI Analysis
 */
async function handleClick() {
    const desc = document.getElementById("desc").value.trim();
    const titleVal = document.getElementById("title").value.trim() || "Issue";
    if (!desc) {
        alert("Please describe the issue first.");
        return;
    }

    const aiResult = await simulateAIThinking(async () => {
        try {
            const response = await fetch("http://localhost:5001/ml/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: `${titleVal} ${desc}` })
            });
            return await response.json();
        } catch (e) {

            console.error("AI Service Error:", e);
            return { category: "other", priority: "medium", error: true };
        }
    });

    // Show results
    const rightBox = document.getElementById("rightBox");
    rightBox.classList.remove("hidden");
    setTimeout(() => rightBox.classList.add("show"), 50);

    // Automatic ID generation (Draft)
    const draftId = "cv" + Math.random().toString(36).substr(2, 8);
    document.getElementById("cid_input").value = draftId;

    document.getElementById("category").value = aiResult.category.charAt(0).toUpperCase() + aiResult.category.slice(1);

    document.getElementById("priority").value = aiResult.priority.charAt(0).toUpperCase() + aiResult.priority.slice(1);
    
    if (aiResult.error) {
        alert("AI Service is offline. Using standard defaults.");
    }
}

/**
 * Step 2: Final Submission
 */
async function submitComplaint(e) {
    if (e) e.preventDefault();
    
    const area = document.getElementById("area").value.trim();
    const title = document.getElementById("title").value.trim() || "Civic Issue";
    const desc = document.getElementById("desc").value.trim();
    const category = document.getElementById("category").value.toLowerCase();
    const priority = document.getElementById("priority").value.toLowerCase();
    const fileInput = document.getElementById("fileInput");

    if (!area) {
        alert("Please enter the specific location/area.");
        return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", desc);
    formData.append("area", area);
    formData.append("category", category);
    formData.append("priority", priority);

    if (fileInput.files.length > 0) {
        for (let i = 0; i < fileInput.files.length; i++) {
            formData.append("images", fileInput.files[i]);
        }
    }

    try {
        console.log("Submitting complaint data...", Object.fromEntries(formData));
        const result = await apiClient.post("/complaints", formData, true);
        console.log("Submission Result:", result);

        if (result.success || (result.complaintId && !result.error)) {
            // Populate and Show Rebuilt Modal with defaults for safety
            const cid = result.complaintId || document.getElementById("cid_input").value;
            const dept = (result.complaint && result.complaint.assignedDept) || "Administration";
            
            document.getElementById("finalID").innerText = cid;
            document.getElementById("finalDeptShow").innerText = dept.toUpperCase();
            
            console.log("Showing Success Popup for CID:", cid);
            document.getElementById("finalSuccessPopup").style.display = "flex";
            
            // Re-load sidebar history to show the new complaint
            loadHistory();
        } else {
            console.warn("Submission failed according to backend:", result);
            alert("Submission failed: " + (result.error || "Please verify all fields."));
        }
    } catch (err) {
        console.error("CRITICAL ERROR during submission:", err);
        alert("Server connection failed or unexpected error occurred. Check the terminal.");
    }
}


function copyID() {
    const id = document.getElementById("finalID").innerText;
    navigator.clipboard.writeText(id);
    alert("ID Copied: " + id);
}

// GPS & Drag-Drop remain similar but cleaned up
function detectGPS() {
    const area = document.getElementById("area");
    area.value = "Locating...";
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            area.value = `📍 [${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}] Verified`;
        }, () => {
            area.value = "GPS blocked. Please enter area manually.";
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const area = document.getElementById("uploadArea");
    const input = document.getElementById("fileInput");
    const text = document.getElementById("uploadText");
    if (area && input) {
        area.addEventListener("dragover", (e) => { e.preventDefault(); area.style.borderColor = "#489c4c"; });
        area.addEventListener("dragleave", () => area.style.borderColor = "#cbd5e1");
        area.addEventListener("drop", (e) => {
            e.preventDefault();
            if (e.dataTransfer.files.length) {
                input.files = e.dataTransfer.files;
                text.innerText = `Matched: ${e.dataTransfer.files[0].name}`;
            }
        });
        input.addEventListener("change", () => {
            if (input.files.length) text.innerText = `Selected: ${input.files[0].name}`;
        });
    }
});