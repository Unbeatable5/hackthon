# CivicSense – Smart City Complaint Management

A full-stack application (CivicSense) designed to bridge the gap between citizens and municipal authorities. Features include AI-based complaint classification, real-time SLA tracking, and an interactive authority dashboard.

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ 
- **Python**: v3.9+ (for ML Service)
- **MongoDB**: Local or Atlas connection URI

### 2. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (see `.env.example` or use the following):
   ```env
   MONGO_URI=mongodb://localhost:27017/civicsense
   JWT_SECRET=your_secret_key
   PORT=5000
   ML_SERVICE_URL=http://localhost:5001
   ```
4. Seed Authority Accounts (Required for first run):
   ```bash
   node seedAuthority.js
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

### 3. ML Service Setup (AI Classifier)
1. Navigate to `backend/ml`:
   ```bash
   cd backend/ml
   ```
2. Install Python requirements:
   ```bash
   pip install -r requirements.txt
   ```
3. (Optional) Train the model:
   ```bash
   python train.py
   ```
4. Start the Flask server:
   ```bash
   python app.py
   ```

### 4. Frontend Setup
- Simply open `frontend/index.html` using a local server (e.g., VS Code **Live Server** at `http://127.0.0.1:5500`).
- Ensure the backend is running at port 5000 for the API to work.

---

## 🔐 Credentials & Access

### **Local Authorities (Log in at `dash.html`)**
| Department | Email | Password |
| :--- | :--- | :--- |
| **Water** | `water@civicsense.com` | `authority123` |
| **Roads** | `road@civicsense.com` | `authority123` |
| **Electricity** | `electrical@civicsense.com` | `authority123` |
| **Sanitation** | `sanitation@civicsense.com` | `authority123` |
| **Full Admin** | `admin@civicsense.com` | `authority123` |

### **Citizen**
- Sign up directly at `veri.html` (Citizen Portal).

---

## 🛠 Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express, Mongoose (MongoDB)
- **AI/ML**: Python (Flask), Scikit-Learn (Complaint classification)
- **Icons**: Google Material Icons

## 📝 Features
- **Auto-Routing**: Complaints are automatically assigned to the correct department using AI.
- **SLA Engine**: Real-time 24h countdown for complaints.
- **Visual Analytics**: Interactive bars for category and location distribution.
- **Dynamic Updates**: Mark complaints as "Delayed", "In Progress", or "Resolved" with images.
