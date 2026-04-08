let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
function goPage(page) {
    window.location.href = page;
  }
  function loadPatients() {
    const table = document.getElementById("patientTable");
    if (!table) return;
  
    table.innerHTML = "";
  
    appointments.forEach((app, index) => {
      table.innerHTML += `
        <tr>
        <td>
        <span class="link" onclick="showDetails(${index})">
          ${app.patient}
        </span>
      </td>
      
      <td>
  <span class="link" onclick="showDoctorAppointments('${app.doctor}')">
    ${app.doctor}
  </span>
</td>
          <td>${app.hospital}</td>
          <td>${app.specialty}</td>
          <td>${app.date}</td>
          <td class="time-text">
  ${formatTime(app.time)}
</td>
          <td>
      <i data-lucide="pencil" onclick="editAppointment(${index})" class="action-icon"></i>
      <i data-lucide="trash-2" onclick="deleteAppointment(${index})" class="action-icon delete"></i>
    </td>
        </tr>
      `;
    });
  
    
    lucide.createIcons();
  }
  loadPatients();

  let currentDate = new Date();
  function nextMonth() {
    currentDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    renderCalendar();
  }
  
  function prevMonth() {
    currentDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    renderCalendar();
  }

  function renderCalendar() {
    const calendar = document.getElementById("calendar");
    const monthYear = document.getElementById("monthYear");
  
    if (!calendar) return;
  
    calendar.innerHTML = "";
  
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
  
    // Month name
    if (monthYear) {
      monthYear.innerText = currentDate.toLocaleString("default", {
        month: "long",
        year: "numeric"
      });
    }
  
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
  
    const prevLastDate = new Date(year, month, 0).getDate();
  
    //  PREVIOUS MONTH DAYS
    for (let i = firstDay; i > 0; i--) {
      calendar.innerHTML += `
        <div class="day other-month">
          <div class="day-number">${prevLastDate - i + 1}</div>
        </div>
      `;
    }
  
    //  CURRENT MONTH DAYS
    const today = new Date();

for (let day = 1; day <= totalDays; day++) {

  const isToday =
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const dayAppointments = appointments.filter(app => app.date === fullDate);

  let appointmentHTML = "";

  dayAppointments.forEach(app => {
    const index = appointments.indexOf(app);

    appointmentHTML += `
      <div class="appointment-card">
        <div class="info">
          ${app.patient} (${app.specialty || "Arrived"}) ${app.time}
        </div>

        <div class="actions">
          <i data-lucide="edit" onclick="editAppointment(${index})"></i>
          <i data-lucide="trash-2" onclick="deleteAppointment(${index})"></i>
          <i data-lucide="eye" onclick="showDetails(${index})"></i>
        </div>
      </div>
    `;
  });

  calendar.innerHTML += `
    <div class="day ${isToday ? "today" : ""}">
      <div class="day-number">${day}</div>
      ${appointmentHTML}
    </div>
  `;
}
  
    // NEXT MONTH DAYS 
const totalCells = firstDay + totalDays;

// calculate rows (5 or 6)
const totalRows = Math.ceil(totalCells / 7);
const totalBoxesNeeded = totalRows * 7;

// remaining boxes for next month
const remaining = totalBoxesNeeded - totalCells;

for (let i = 1; i <= remaining; i++) {
  calendar.innerHTML += `
    <div class="day other-month">
      <div class="day-number">${i}</div>
    </div>
  `;
}
  
    lucide.createIcons();
  }
document.getElementById("prevMonth")?.addEventListener("click", () => {
    currentDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    renderCalendar();
  });
  
  document.getElementById("nextMonth")?.addEventListener("click", () => {
    currentDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    renderCalendar();
  });
  renderCalendar();

  document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById("modal");
    const openBtn = document.getElementById("openModal");
    const closeBtn = document.getElementById("closeModal");
    const cancelBtn = document.getElementById("cancelBtn");
    const saveBtn = document.getElementById("saveBtn");
  
    // OPEN MODAL
    if (openBtn) {
      openBtn.onclick = () => {
        modal.style.display = "flex";
      };
    }
  
    // CLOSE (X)
    if (closeBtn) {
      closeBtn.onclick = () => {
        modal.style.display = "none";
        clearForm(); 
      };
    }
  
    // CANCEL
    if (cancelBtn) {
      cancelBtn.onclick = () => {
        modal.style.display = "none";
        clearForm(); 
      };
    }
  
    // SAVE
    if (saveBtn) {
      saveBtn.onclick = () => {
        const patient = document.getElementById("patient").value;
        const doctor = document.getElementById("doctor").value;
        const hospital = document.getElementById("hospital").value;
        const specialty = document.getElementById("specialty").value;
        const date = document.getElementById("dateInput").value;
        const time = document.getElementById("timeInput").value;

        function add30Minutes(time) {
          let [h, m] = time.split(":").map(Number);
          m += 30;
        
          if (m >= 60) {
            h += 1;
            m -= 60;
          }
        
          return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        }
        
        const endTime = add30Minutes(time);
        
        if (!patient || !doctor || !date || !time) {
          alert("Fill required fields");
          return;
        }
  
        const appointment = {
          patient,
          doctor,
          hospital,
          specialty,
          date,
          time: `${time} - ${endTime}`
        };
  
        if (editIndex !== null) {
          appointments[editIndex] = appointment; // update
          editIndex = null;
        } else {
          appointments.push(appointment); // new
        }
        localStorage.setItem("appointments", JSON.stringify(appointments));
        appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  
        modal.style.display = "none";
        clearForm();   
        renderCalendar();
        loadPatients();
      };
    }
  
  });

  document.getElementById("doctor").addEventListener("change", function () {
    const selected = this.value;
  
    const doctor = doctors.find(d => d.name === selected);
  
    if (doctor) {
      document.getElementById("hospital").value = doctor.hospital;
      document.getElementById("specialty").value = doctor.specialty;
    }
  });
  function formatTime(time) {
    // If already formatted → return as is
    if (time.includes("-")) return time;
  
    let [h, m] = time.split(":").map(Number);
    m += 30;
  
    if (m >= 60) {
      h += 1;
      m -= 60;
    }
  
    const end = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  
    return `${time} - ${end}`;
  }
  function deleteAppointment(index) {
    appointments.splice(index, 1);
    localStorage.setItem("appointments", JSON.stringify(appointments));
    renderCalendar();
    loadPatients();
  }
  
  function editAppointment(index) {
    const app = appointments[index];
  
    document.getElementById("patient").value = app.patient;
    document.getElementById("doctor").value = app.doctor;
    document.getElementById("hospital").value = app.hospital;
    document.getElementById("specialty").value = app.specialty;
    document.getElementById("date").value = app.date;
    document.getElementById("time").value = app.time;
  
    document.getElementById("modal").style.display = "flex";
  
    loadPatients();
    renderCalendar();
  }

  function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const icon = document.getElementById("toggleIcon");
  
    sidebar.classList.toggle("collapsed");
  
    if (sidebar.classList.contains("collapsed")) {
      icon.setAttribute("data-lucide", "chevrons-right");
    } else {
      icon.setAttribute("data-lucide", "chevrons-left");
    }
  
    lucide.createIcons();
  }

  function clearForm() {
    document.getElementById("patient").value = "";
    document.getElementById("doctor").value = "";
    document.getElementById("hospital").value = "";
    document.getElementById("specialty").value = "";
    document.getElementById("dateInput").value = "";
    document.getElementById("timeInput").value = "";
    document.getElementById("reason").value = "";
  }
  lucide.createIcons();
 

  /* DASHBOARD*/

function filterPatients() {
  const patientInput = document.querySelectorAll(".filters input")[0].value.toLowerCase();
  const doctorInput = document.querySelectorAll(".filters input")[1].value.toLowerCase();
  const fromDate = document.querySelectorAll(".filters input")[2].value;
  const toDate = document.querySelectorAll(".filters input")[3].value;

  const rows = document.querySelectorAll("#patientTable tr");

  rows.forEach(row => {
    const patient = row.children[0].innerText.toLowerCase();
    const doctor = row.children[1].innerText.toLowerCase();
    const date = row.children[4].innerText;

    let match = true;

    // Patient filter
    if (patientInput && !patient.includes(patientInput)) {
      match = false;
    }

    // Doctor filter
    if (doctorInput && !doctor.includes(doctorInput)) {
      match = false;
    }

    // Date range filter
    if (fromDate && date < fromDate) {
      match = false;
    }

    if (toDate && date > toDate) {
      match = false;
    }

    row.style.display = match ? "" : "none";
  });
}

  function showDetails(index) {
    const app = appointments[index];
  
    const modal = document.getElementById("detailsModal");
    const content = document.getElementById("detailsContent");
  
    if (!app || !modal || !content) return;
  
    content.innerHTML = `
      <p><b>Patient:</b> ${app.patient}</p>
      <p><b>Doctor:</b> ${app.doctor}</p>
      <p><b>Date:</b> ${app.date}</p>
      <p><b>Time:</b> ${app.time}</p>
      <p><b>Hospital:</b> ${app.hospital}</p>
      <p><b>Specialty:</b> ${app.specialty}</p>
    `;
  
    modal.style.display = "flex";
  }
  
  function closeDetails() {
    document.getElementById("detailsModal").style.display = "none";
  }

  function showDoctorAppointments(doctorName) {
    const modal = document.getElementById("detailsModal");
    const content = document.getElementById("detailsContent");
  
    // filter all appointments of that doctor
    const doctorApps = appointments.filter(app => app.doctor === doctorName);
  
    if (!doctorApps.length) {
      content.innerHTML = "<p>No appointments found</p>";
    } else {
      let html = `<h4>Appointments for Dr. ${doctorName}</h4><br>`;
  
      doctorApps.forEach((app, i) => {
        html += `
          <div style="margin-bottom:10px;">
            <b>Appointment ${i + 1}</b><br>
            Patient: ${app.patient} <br>
            Date: ${app.date} <br>
            Time: ${formatTime(app.time)} <br>
          </div>
          <hr>
        `;
      });
  
      content.innerHTML = html;
    }
  
    modal.style.display = "flex";
  }

  const doctors = [
    {
      name: "Dr. Sarah Jenkins",
      specialty: "Cardiology",
      hospital: "City General Hospital"
    },
    {
      name: "Dr. Mark Thompson",
      specialty: "Pediatrics",
      hospital: "Sunshine Children's Clinic"
    },
    {
      name: "Dr. Anita Desai",
      specialty: "Neurology",
      hospital: "Regional Brain & Spine Center"
    },
    {
      name: "Dr. David Wilson",
      specialty: "Dermatology",
      hospital: "Metro Skin & Aesthetics"
    },
    {
      name: "Dr. Priya Sharma",
      specialty: "Obstetrics & Gynecology",
      hospital: "Women's Wellness Hospital"
    },
    {
      name: "Dr. Robert Brown",
      specialty: "Orthopedics",
      hospital: "Apex Ortho Associates"
    },
    {
      name: "Dr. Emily White",
      specialty: "Endocrinology",
      hospital: "Horizon Medical Centre"
    },
    {
      name: "Dr. James Miller",
      specialty: "Gastroenterology",
      hospital: "Valley Digestive Health"
    },
    {
      name: "Dr. Lisa Garcia",
      specialty: "Oncology",
      hospital: "Hope Oncology Center"
    },
    {
      name: "Dr. Kevin Zhang",
      specialty: "Emergency Medicine",
      hospital: "Lifeline Emergency Clinic"
    }
  ];

  function loadDoctors() {
    const doctorSelect = document.getElementById("doctor");
  
    doctors.forEach(doc => {
      const option = document.createElement("option");
      option.value = doc.name;
      option.textContent = doc.name;
      doctorSelect.appendChild(option);
    });
  }
 

  let selectedDate = new Date();

function openCalendar() {
  const popup = document.getElementById("calendarPopup");
  popup.style.display = "block";
  renderPopupCalendar();
}

function renderPopupCalendar() {
  const popup = document.getElementById("calendarPopup");

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  let html = `
    <div class="calendar-header">
      <button onclick="changeMonth(-1)">‹</button>
      <span>${selectedDate.toLocaleString('default',{month:'long'})} ${year}</span>
      <button onclick="changeMonth(1)">›</button>
    </div>
    <div class="calendar-days">
  `;

  for (let i = 0; i < firstDay; i++) {
    html += `<div></div>`;
  }

  for (let d = 1; d <= totalDays; d++) {
    html += `<div onclick="selectDate(${d})">${d}</div>`;
  }

  html += `</div>`;
  popup.innerHTML = html;
}

function selectDate(day) {
  const month = selectedDate.getMonth() + 1;
  const year = selectedDate.getFullYear();
  
  document.getElementById("dateInput").value =
    `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

  document.getElementById("calendarPopup").style.display = "none";
  
}
document.getElementById("calendarPopup").addEventListener("click", e => e.stopPropagation());

function changeMonth(val) {
  selectedDate.setMonth(selectedDate.getMonth() + val);
  renderPopupCalendar();
}

function toggleTime() {
  const popup = document.getElementById("timePopup");
  popup.style.display = popup.style.display === "block" ? "none" : "block";

  let html = "";
  for (let h = 9; h <= 18; h++) {
    html += `<div onclick="selectTime('${h}:00')">${h}:00</div>`;
    html += `<div onclick="selectTime('${h}:30')">${h}:30</div>`;
  }
  popup.innerHTML = html;
}

function selectTime(time) {
  
  document.getElementById("timeInput").value = time;
  
  document.getElementById("timePopup").style.display = "none";

}
document.getElementById("timePopup").addEventListener("click", e => e.stopPropagation());
document.addEventListener("click", function(e) {
  const cal = document.getElementById("calendarPopup");
  const time = document.getElementById("timePopup");
  const dateInput = document.getElementById("dateInput");
  const timeInput = document.getElementById("timeInput");

  // Close calendar
  if (cal && !cal.contains(e.target) && e.target !== dateInput) {
    cal.style.display = "none";
  }

  // Close time picker
  if (time && !time.contains(e.target) && e.target !== timeInput) {
    time.style.display = "none";
  }
});
let editIndex = null;
function editAppointment(index) {
  const app = appointments[index];

  document.getElementById("patient").value = app.patient;
  document.getElementById("doctor").value = app.doctor;
  document.getElementById("hospital").value = app.hospital;
  document.getElementById("specialty").value = app.specialty;
  document.getElementById("dateInput").value = app.date;
  document.getElementById("timeInput").value = app.time.split(" - ")[0];

  editIndex = index; //store index

  document.getElementById("modal").style.display = "flex";
}
window.onload = function () {  
  loadPatients();
  renderCalendar();
  lucide.createIcons();  
  loadDoctors();
};
