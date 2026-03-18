function startAI(){

let desc=document.getElementById("desc").value;

if(desc==""){
alert("Please describe your issue");
return;
}


/* blur form */

document.getElementById("formCard").classList.add("blur");


/* show loader */

document.getElementById("loaderScreen").style.display="flex";


/* simulate AI processing */

setTimeout(function(){

document.getElementById("loaderScreen").style.display="none";

document.getElementById("formCard").classList.remove("blur");

document.getElementById("aiSection").style.display="block";

},3000);

}
function submitComplaint(){

let popup = document.getElementById("successPopup");

popup.style.display = "block";

/* redirect after 2 seconds */

setTimeout(function(){

window.location.href="pop.html";

},2000);

}