
let jobs = []; // { from, to, position, description }

function generate_CV() {
  const val = id => document.getElementById(id).value;

  document.getElementById("cv-name").innerText        = val("name")         || "Name";
  document.getElementById("cv-job").innerText         = val("job")          || "Position";
  document.getElementById("birthday").innerText       = val("birth")        || "Date of Birth";
  document.getElementById("cv-email").innerText       = val("email")        || "Email";
  document.getElementById("cv-phone").innerText       = val("phone-number") || "Phone";
  document.getElementById("degree-name").innerText    = val("cv-degree")    || "Degree";
  document.getElementById("cv-languages").innerText   = val("languages")    || "Languages";
  document.getElementById("cv-summary").innerText     = val("cv-sum")       || "About candidate";

  const skills = val("skills");
  document.getElementById("cv-skills").innerHTML = skills
    ? "<ul><li>" + skills.split(",").map(s => s.trim()).join("</li><li>") + "</li></ul>"
    : "Your skills";

  save_to_storage();
}
function render_jobs() {
  document.getElementById("jobs").innerHTML = jobs.map((j, i) => `
    <div class="job">
      <div class="job-header">
        <span class="job-dates">${j.from}${j.to ? " – " + j.to : ""}</span>
        <button class="remove-job" onclick="remove_job(${i})" title="Remove">✕</button>
      </div>
      <h4>${j.position}</h4>
      <p>${j.description}</p>
    </div>
  `).join("");
}


function add_job() {
  const from        = document.getElementById("job-from").value.trim();
  const to          = document.getElementById("job-to").value.trim();
  const position    = document.getElementById("position").value.trim();
  const description = document.getElementById("position-description").value.trim();

  if (!from && !position) return;

  jobs.push({ from, to, position, description });
  render_jobs();
  save_to_storage();

  ["job-from","job-to","position","position-description"].forEach(id => {
    document.getElementById(id).value = "";
  });
}

function remove_job(index) {
  jobs.splice(index, 1);
  render_jobs();
  save_to_storage();
}

function save_to_storage() {
  const fields = ["name","job","birth","email","phone-number","cv-degree","skills","languages","cv-sum"];
  const data = {};
  fields.forEach(id => data[id] = document.getElementById(id).value);
  data.jobs = jobs;
  localStorage.setItem("cvmaker_data", JSON.stringify(data));
}

function load_from_storage() {
  const raw = localStorage.getItem("cvmaker_data");
  if (!raw) return;

  try {
    const data = JSON.parse(raw);
    const fields = ["name","job","birth","email","phone-number","cv-degree","skills","languages","cv-sum"];
    fields.forEach(id => {
      if (data[id] !== undefined) document.getElementById(id).value = data[id];
    });
    if (Array.isArray(data.jobs)) {
      jobs = data.jobs;
      render_jobs();
    }
    generate_CV();
  } catch(e) {
    console.error("Failed to load saved data", e);
  }
}

function clear_all() {
  if (!confirm("Очистить все данные?")) return;
  localStorage.removeItem("cvmaker_data");
  jobs = [];
  ["name","job","birth","email","phone-number","cv-degree","skills","languages","cv-sum"].forEach(id => {
    document.getElementById(id).value = "";
  });
  render_jobs();
  generate_CV();
}

function download_pdf() {
  const element = document.getElementById("cv");
  const name = document.getElementById("name").value.trim() || "cv";


  document.querySelectorAll(".remove-job").forEach(b => b.style.display = "none");
  const container = document.querySelector(".container");
  const prevContainer = container.style.cssText;
  const prevElement   = element.style.cssText;

  container.style.cssText = "display:block; padding:0; margin:0;";
  Object.assign(element.style, {
    width: "794px", minHeight: "auto",
    padding: "40px 45px", borderRadius: "0",
    boxShadow: "none", position: "static"
  });

  setTimeout(() => {
    const h = element.scrollHeight + 60;
    const opt = {
      margin:   0,
      filename: name + ".pdf",
      image:    { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollX: 0, scrollY: 0 },
      jsPDF: { unit: "px", format: [794, h], orientation: "portrait", hotfixes: ["px_scaling"] }
    };
    html2pdf().set(opt).from(element).save().then(() => {
      container.style.cssText = prevContainer;
      element.style.cssText   = prevElement;
      document.querySelectorAll(".remove-job").forEach(b => b.style.display = "");
    });
  }, 100);
}

document.querySelectorAll("input, textarea").forEach(el => {
  el.addEventListener("input", generate_CV);
});

load_from_storage();
