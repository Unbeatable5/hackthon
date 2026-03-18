let otp = "";

const generateBtn = document.getElementById("generateBtn");
const verifyBtn = document.getElementById("verifyBtn");
const otpInput = document.getElementById("otpInput");
const boxes = document.querySelectorAll(".otp-boxes div");
const msg = document.getElementById("msg");
const loading = document.getElementById("loading");
const otpWrapper = document.getElementById("otpWrapper");

function focusOTP() {
  otpInput.focus();
}

generateBtn.onclick = () => {
  const mobile = document.getElementById("mobile").value;

  if (!/^\d{10}$/.test(mobile)) {
    msg.style.color = "red";
    msg.innerText = "Enter valid 10-digit mobile number";
    return;
  }

  msg.innerText = "";
  loading.classList.remove("hidden");
  otpWrapper.classList.add("hidden");
  verifyBtn.classList.add("hidden");

  // Simulate OTP delay
  setTimeout(() => {
    loading.classList.add("hidden");

    otp = Math.floor(100000 + Math.random() * 900000).toString();
    alert("Demo OTP: " + otp);

    generateBtn.innerText = "Resend OTP";
    generateBtn.classList.remove("green");
    generateBtn.classList.add("red");

    otpWrapper.classList.remove("hidden");
    verifyBtn.classList.remove("hidden");

    otpInput.value = "";
    boxes.forEach(b => b.innerText = "");
    otpInput.focus();
  }, 2000); // 2 seconds loading
};

otpInput.addEventListener("input", () => {
  otpInput.value = otpInput.value.replace(/\D/g, "").slice(0, 6);

  boxes.forEach((box, i) => {
    box.innerText = otpInput.value[i] || "";
  });
});

verifyBtn.onclick = () => {
  if (otpInput.value === otp) {
    msg.style.color = "#489c4c";
    msg.innerText = "✅ OTP Verified Successfully";

    // Redirect after success
    setTimeout(() => {
      window.location.href = "submit.html";
    }, 1500);
  } else {
    msg.style.color = "red";
    msg.innerText = "❌ Invalid OTP";
  }
};
