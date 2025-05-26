document.getElementById("appointmentForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const appointment = {
    id: Date.now(),
    fullname: document.getElementById("fullname").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    date: document.getElementById("date").value,
    time: document.getElementById("time").value,
    message: document.getElementById("message").value
  };

  let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  appointments.push(appointment);
  localStorage.setItem("appointments", JSON.stringify(appointments));

  this.reset();
  loadAppointments();
});

function loadAppointments() {
  const list = document.getElementById("appointmentList");
  list.innerHTML = "";
  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

  appointments.forEach(app => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${app.fullname}</strong> (${app.email})<br>
      📅 ${app.date} ⏰ ${app.time}<br>
      📞 ${app.phone}<br>
      📝 ${app.message || "N/A"}
      <br>
      <button onclick="deleteAppointment(${app.id})">Delete</button>
    `;
    list.appendChild(li);
  });
}

function deleteAppointment(id) {
  let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  appointments = appointments.filter(app => app.id !== id);
  localStorage.setItem("appointments", JSON.stringify(appointments));
  loadAppointments();
}

window.onload = loadAppointments;
