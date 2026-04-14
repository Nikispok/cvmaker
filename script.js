function generate_CV() {
  const name = document.getElementById("name").value;
  const job = document.getElementById("job").value;
  const email = document.getElementById("email").value;
  const number = document.getElementById("phone-number").value;
  const degree = document.getElementById("cv-degree").value;
  const skills = document.getElementById("skills").value;
  const languages = document.getElementById("languages").value;
  const summary = document.getElementById("cv-sum").value;
  const dateOfBirth = document.getElementById("birth").value;
  

  document.getElementById("cv-name").innerText = name || "Name";
  document.getElementById("cv-job").innerText = job || "Job";
  document.getElementById("birthday").innerText = dateOfBirth || "Date of Birth";
  document.getElementById("cv-email").innerText = email || "Email";
  document.getElementById("cv-phone").innerText = number || "Number";
  document.getElementById("degree-name").innerText = degree || "Degre";
  document.getElementById("cv-skills").innerHTML =
  skills
    ? "<ul><li>" + skills.split(",").join("</li><li>") + "</li></ul>"
    : "Your skills";
  document.getElementById("cv-languages").innerText =
   languages || "Languages";
  document.getElementById("cv-summary").innerText = summary || "Summary";

  
}

function add_job(){
  const job_from = document.getElementById("job-from").value;
  const job_to = document.getElementById("job-to").value;
  const position = document.getElementById("position").value;
  const description = document.getElementById("position-description").value;

  const job_html = `
    <div class="job">
      <p>${job_from} - ${job_to} </p>
      <h4>${position}</h4>
      <p>${description}</p>
    </div>
  `;

  document.getElementById("jobs").innerHTML+=job_html;

  document.getElementById("job-from").value = "";
  document.getElementById("job-to").value = "";
  document.getElementById("position").value = "";
  document.getElementById("position-description").value = "";
  

}

function download_pdf() {
    const element = document.getElementById("cv");

    html2pdf().from(element).save("cv.pdf")

}
document.querySelectorAll("input, textarea").forEach(el => {
  el.addEventListener("input", generate_CV);
});