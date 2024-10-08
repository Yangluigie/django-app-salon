document.addEventListener("DOMContentLoaded", () => {
  iniciarApp();
  panelAdmin();
});

function iniciarApp() {
  logout();
  const fechaInput = document.querySelector("#fecha");
  fechaInput.addEventListener("change", function () {
    const fechaSeleccionada = this.value;
    if (fechaSeleccionada) {
      obtenerCitasPorFecha(fechaSeleccionada);
    }
  });
}

function panelAdmin() {
  const panelAdminBtn = document.getElementById("PanelAdmin");
  const citaAdminBtn = document.getElementById("CitaAdmin");
  const serviciosAdminBtn = document.getElementById("ServiciosAdmin");
  const buscarCitasContainer = document.getElementById("buscarCitasContainer");
  const citasAdminContainer = document.getElementById("citas-admin");
  const tituloListaCitas = document.getElementById("titulo-lista-citas");
  const resultadoCitas = document.getElementById("resultadoCitas");

  // Ocultar todos los contenedores al inicio, excepto el de buscarCitasContainer
  buscarCitasContainer.style.display = "block"; // Mostrar el input de fecha
  citasAdminContainer.style.display = "none";
  tituloListaCitas.style.display = "none";

  // Mostrar el panel de administración al hacer clic
  if (panelAdminBtn) {
    panelAdminBtn.addEventListener("click", function () {
      // Limpiar el contenedor y mostrar solo el panel de administración
      limpiarCitas(); // Limpia el contenedor de citas
      buscarCitasContainer.style.display = "block"; // Mostrar input de fecha
      citasAdminContainer.style.display = "none";
      tituloListaCitas.style.display = "none";
      document.getElementById("titulo-panel").textContent =
        "Panel de Administración";
      document.querySelector("#fecha").value = ""; // Limpia el campo de fecha
    });
  }

  // Mostrar las citas al hacer clic en "Citas"
  if (citaAdminBtn) {
    citaAdminBtn.addEventListener("click", function () {
      // Limpiar el contenedor y mostrar las citas
      limpiarCitas(); // Limpia el contenedor de citas
      obtenerCitas();
      buscarCitasContainer.style.display = "none"; // Ocultar input de fecha
      citasAdminContainer.style.display = "block";
      tituloListaCitas.style.display = "block";
      document.getElementById("titulo-panel").textContent = "Lista de Citas";
    });
  }

  // Mostrar los servicios al hacer clic en "Servicios"
  if (serviciosAdminBtn) {
    serviciosAdminBtn.addEventListener("click", function () {
      // Limpiar el contenedor y mostrar solo los servicios
      limpiarCitas(); // Limpia el contenedor de citas
      buscarCitasContainer.style.display = "none"; // Ocultar input de fecha
      citasAdminContainer.style.display = "none";
      tituloListaCitas.style.display = "none";
      document.getElementById("titulo-panel").textContent =
        "Servicios Disponibles";
    });
  }
}

// Función para limpiar el contenedor de citas
function limpiarCitas() {
  const resultadoCitas = document.getElementById("resultadoCitas");
  resultadoCitas.innerHTML = ""; // Limpia el contenedor de citas
}

function obtenerCitas() {
  const url = "http://127.0.0.1:8000/reservaciones/citas/detalles/";

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Hubo un problema con la petición: " + response.statusText
        );
      }
      return response.json();
    })
    .then((data) => {
      document.getElementById("titulo-panel").textContent = "Lista de Citas";
      mostrarCitas(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function obtenerCitasPorFecha(fecha) {
  fetch(`http://127.0.0.1:8000/reservaciones/citas/detalles/?fecha=${fecha}`)
    .then((response) => {
      if (response.status === 404) {
        throw new Error("No se encontraron citas para esta fecha");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Respuesta de la API:", data); // Para verificar la respuesta
      if (Array.isArray(data) && data.length > 0) {
        mostrarCitas(data); // Llama a mostrarCitas con data directamente
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No hay citas disponibles para esta fecha.",
        });
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Hubo un problema",
        text: error.message,
      });
    });
}

function mostrarCitas(citas) {
  const listaCitas = document.getElementById("citas-list"); // Asegúrate de que este ID sea correcto
  if (!listaCitas) {
    console.error("Elemento citas-list no encontrado en el DOM");
    return; // Salir si no se encuentra el elemento
  }

  listaCitas.innerHTML = ""; // Limpiar la lista anterior

  console.log("Citas a mostrar:", citas); // Para verificar las citas que se están mostrando

  if (Array.isArray(citas) && citas.length > 0) {
    // Mostrar el título de la lista de citas
    document.getElementById("titulo-lista-citas").style.display = "block";
    // Hacer visible el contenedor de citas
    document.getElementById("citas-admin").style.display = "block";

    citas.forEach((cita) => {
      const citaElement = document.createElement("li"); // Cambié a <li> para que coincida con tu estructura
      citaElement.innerHTML = `
        <p>ID: ${cita.id}</p>
        <p>Hora: ${cita.hora}</p>
        <p>Fecha: ${cita.fecha}</p>
        <p>Cliente: ${cita.cliente}</p>
        <p>Email: ${cita.email}</p>
        <p>Teléfono: ${cita.telefono}</p>
        <p>Servicios: ${cita.servicios}</p>
        <p>Precios: ${cita.precios}</p>
        <p>Total: ${cita.total}</p>
      `;
      listaCitas.appendChild(citaElement);
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No hay citas disponibles para esta fecha.",
    });
  }
}

function eliminarCita(id) {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "¡No podrás deshacer esta acción!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`http://127.0.0.1:8000/reservaciones/api/citas/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]")
            .value,
        },
      })
        .then((response) => {
          if (response.status === 204) {
            return { message: "La cita ha sido eliminada." };
          } else if (response.ok) {
            return response.json();
          } else {
            throw new Error("Error en la respuesta del servidor");
          }
        })
        .then((data) => {
          Swal.fire({
            icon: "success",
            title: "¡Eliminado!",
            text: data.message || "La cita ha sido eliminada.",
            confirmButtonText: "OK",
          }).then(() => {
            const fechaSeleccionada = document.querySelector("#fecha").value;
            if (fechaSeleccionada) {
              obtenerCitasPorFecha(fechaSeleccionada);
            } else {
              obtenerCitas();
            }
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un error al eliminar la cita. Intenta de nuevo.",
            confirmButtonText: "OK",
          });
          console.error("Error:", error);
        });
    }
  });
}

function logout() {
  const logoutForm = document.getElementById("logout-form");
  const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;

  if (logoutForm) {
    logoutForm.addEventListener("submit", function (event) {
      event.preventDefault();

      fetch(logoutForm.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
      })
        .then((response) => {
          if (response.ok) {
            Swal.fire({
              icon: "success",
              title: "Cierre de sesión exitoso",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              window.location.href = "/";
            });
          } else {
            throw new Error("Error al cerrar sesión.");
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al cerrar sesión.",
          });
        });
    });
  }
}
