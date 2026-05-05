const form = document.getElementById("registrationForm");
const participantsList = document.getElementById("participantsList");

let participants = JSON.parse(localStorage.getItem("participants")) || [];

function saveToLocalStorage() {
  localStorage.setItem("participants", JSON.stringify(participants));
}

function renderParticipants() {
  participantsList.innerHTML = "";

  participants.forEach((participant, index) => {
    const card = document.createElement("div");
    card.className = "participant-card";

    card.innerHTML = `
                <img src="${participant.photo || "https://via.placeholder.com/100"}" alt="Foto Profil">
                <h3>${participant.name}</h3>
                <p>${participant.address}</p>
                <p>${participant.phone}</p>
                <p>${participant.school}</p>

                <div class="actions">
                    <a class="wa-btn" href="https://wa.me/${participant.phone}" target="_blank">WhatsApp</a>
                    <button class="edit-btn" onclick="editParticipant(${index})">Edit</button>
                    <button class="delete-btn" onclick="deleteParticipant(${index})">Delete</button>
                </div>
            `;

    participantsList.appendChild(card);
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const phone = document.getElementById("phone").value;
  const school = document.getElementById("school").value;
  const photoInput = document.getElementById("photo");
  const editIndex = document.getElementById("editIndex").value;

  const reader = new FileReader();

  reader.onload = function () {
    const photo = photoInput.files[0]
      ? reader.result
      : editIndex !== ""
        ? participants[editIndex].photo
        : "";

    const participantData = {
      name,
      address,
      phone,
      school,
      photo,
    };

    if (editIndex === "") {
      participants.push(participantData);
    } else {
      participants[editIndex] = participantData;
    }

    saveToLocalStorage();
    renderParticipants();
    form.reset();
    document.getElementById("editIndex").value = "";
  };

  if (photoInput.files[0]) {
    reader.readAsDataURL(photoInput.files[0]);
  } else {
    reader.onload();
  }
});

function editParticipant(index) {
  const participant = participants[index];

  document.getElementById("name").value = participant.name;
  document.getElementById("address").value = participant.address;
  document.getElementById("phone").value = participant.phone;
  document.getElementById("school").value = participant.school;
  document.getElementById("editIndex").value = index;

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function deleteParticipant(index) {
  if (confirm("Yakin ingin menghapus peserta ini?")) {
    participants.splice(index, 1);
    saveToLocalStorage();
    renderParticipants();
  }
}

function toggleMode() {
  document.body.classList.toggle("dark");
  const icon = document.getElementById("modeIcon");

  if (document.body.classList.contains("dark")) {
    icon.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  } else {
    icon.textContent = "🌙";
    localStorage.setItem("theme", "light");
  }
}

function loadTheme() {
  const theme = localStorage.getItem("theme");
  const icon = document.getElementById("modeIcon");

  if (theme === "dark") {
    document.body.classList.add("dark");
    icon.textContent = "☀️";
  }
}

loadTheme();
renderParticipants();
