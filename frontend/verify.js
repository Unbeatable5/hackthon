let timeLeft = 30;
let countdown;

const generateBtn = document.getElementById("generateBtn");
const verifyBtn = document.getElementById("verifyBtn");
const otpInput = document.getElementById("otpInput");
const boxes = document.querySelectorAll(".otp-boxes div");
const msg = document.getElementById("msg");
const loading = document.getElementById("loading");
const otpWrapper = document.getElementById("otpWrapper");
const timerText = document.getElementById("timer");
const userInput = document.getElementById("userInput");

function focusOTP() {
    otpInput.focus();
}

function isValid(input) {
    const email = /^\S+@\S+\.\S+$/;
    const phone = /^\d{10}$/;
    return email.test(input) || phone.test(input);
}

// GENERATE OTP (Register/Login)
generateBtn.onclick = async () => {
    let identifier = userInput.value.trim();

    if (!isValid(identifier)) {
        msg.style.color = "red";
        msg.innerText = "Enter a valid email or 10-digit phone number";
        return;
    }

    msg.innerText = "";
    loading.classList.remove("hidden");
    otpWrapper.classList.add("hidden");
    verifyBtn.classList.add("hidden");

    try {
        const response = await fetch("http://localhost:5000/api/auth/citizen/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier, name: identifier.split('@')[0] })
        });
        const result = await response.json();

        loading.classList.add("hidden");
        if (response.ok) {
            msg.style.color = "#489c4c";
            msg.innerText = result.message;

            if (result.isMock) {
                alert("OTP Sent Successfully");
            }

            generateBtn.innerText = "Resend OTP";
            generateBtn.classList.replace("green", "red");

            otpWrapper.classList.remove("hidden");
            verifyBtn.classList.remove("hidden");
            startTimer();
            otpInput.value = "";
            boxes.forEach(b => b.innerText = "");
            otpInput.focus();
        } else {
            msg.style.color = "red";
            msg.innerText = result.error || "Failed to send OTP";
        }
    } catch (error) {
        console.error("Registration error:", error);
        loading.classList.add("hidden");
        msg.style.color = "red";
        msg.innerText = "Server unreachable";
    }
};

otpInput.addEventListener("input", () => {
    otpInput.value = otpInput.value.replace(/\D/g, "").slice(0, 6);
    boxes.forEach((box, i) => {
        box.innerText = otpInput.value[i] || "";
    });
});

// VERIFY OTP & LOGIN
verifyBtn.onclick = async () => {
    const identifier = userInput.value.trim();
    const otp = otpInput.value;

    if (otp.length !== 6) {
        msg.style.color = "red";
        msg.innerText = "Enter 6-digit OTP";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/auth/citizen/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier, otp })
        });
        const result = await response.json();

        if (response.ok) {
            msg.style.color = "#489c4c";
            msg.innerText = " Successfully Verified";

            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.citizen));
            localStorage.setItem('isVerified', 'true');

            setTimeout(() => {
                window.location.href = "submit.html";
            }, 1000);
        } else {
            msg.style.color = "red";
            msg.innerText = " " + (result.error || "Invalid OTP");
        }
    } catch (error) {
        console.error("OTP Verification error:", error);
        msg.style.color = "red";
        msg.innerText = "Server connection error";
    }
};

function startTimer() {
    timeLeft = 30;
    timerText.classList.remove("hidden");
    if (countdown) clearInterval(countdown);
    countdown = setInterval(() => {
        timeLeft--;
        timerText.innerText = "Resend OTP in " + timeLeft + "s";
        if (timeLeft <= 0) {
            clearInterval(countdown);
            timerText.innerText = "You can resend OTP";
        }
    }, 1000);
}
