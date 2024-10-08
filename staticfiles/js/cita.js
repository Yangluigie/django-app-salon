let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
  nombre: "",
  fecha: "",
  hora: "",
  servicios: [],
};

document.addEventListener("DOMContentLoaded", () => {
  iniciarApp();
});

function iniciarApp() {
  mostrarSeccion(); // muestra y oculta las secciones
  tabs(); // cambia la seccion de los tabs
  botonesPaginador(); //agrega o quita los botones del paginador
  paginaSiguiente();
  paginaAnterior();
  nombreCliente(); //añade el nombre del cliente al objeto de cita
  seleccionarFecha(); // añade la fecha de la cita en el objeto
  configurarFechaMinima(); // años, meses y dias anteriores no permitidos
  seleccionarHora(); // Horas laborales
  mostrarResumen(); // muestra el resumen de la cita
  logout(); // cerrar sesion

  consultarApi(); // consultar la API de servicios
}

function mostrarSeccion() {
  //Ocultar la seccion que tenga la clase de mostrar
  const seccionAnterior = document.querySelector(".mostrar");
  if (seccionAnterior) {
    seccionAnterior.classList.remove("mostrar");
  }

  //Seleccionar la seccion con el paso
  const pasoSelector = `#paso-${paso}`;
  const seccion = document.querySelector(pasoSelector);
  seccion.classList.add("mostrar");

  // quita la clase de actual al tab anterior
  const tabAnterior = document.querySelector(".actual");
  if (tabAnterior) {
    tabAnterior.classList.remove("actual");
  }

  // resalta el tab actual
  const tab = document.querySelector(`[data-paso="${paso}"]`);
  tab.classList.add("actual");
}

function tabs() {
  const botones = document.querySelectorAll(".tabs button");

  botones.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      paso = parseInt(e.target.dataset.paso);

      mostrarSeccion();
      botonesPaginador();
    });
  });
}

function botonesPaginador() {
  const paginaAnterior = document.querySelector("#anterior");
  const paginaSiguiente = document.querySelector("#siguiente");

  if (paso === 1) {
    paginaAnterior.classList.add("ocultarBoton");
    paginaSiguiente.classList.remove("ocultarBoton");
  } else if (paso === 3) {
    paginaAnterior.classList.remove("ocultarBoton");
    paginaSiguiente.classList.add("ocultarBoton");

    mostrarResumen();
  } else {
    paginaAnterior.classList.remove("ocultarBoton");
    paginaSiguiente.classList.remove("ocultarBoton");
  }

  mostrarSeccion();
}

function paginaAnterior() {
  const paginaAnterior = document.querySelector("#anterior");
  paginaAnterior.addEventListener("click", () => {
    if (paso <= pasoInicial) return;
    paso--;

    botonesPaginador();
  });
}

function paginaSiguiente() {
  const paginaSiguiente = document.querySelector("#siguiente");
  paginaSiguiente.addEventListener("click", () => {
    if (paso >= pasoFinal) return;
    paso++;

    botonesPaginador();
  });
}

async function consultarApi() {
  try {
    const url = "http://127.0.0.1:8000/reservaciones/api/servicios/";
    const resultado = await fetch(url);
    const servicios = await resultado.json();

    mostrarServicios(servicios);
  } catch (error) {
    console.log(error);
  }
}

function mostrarServicios(servicios) {
  servicios.forEach((servicio) => {
    const { id, nombre, precio } = servicio;

    const nombreServicio = document.createElement("P");
    nombreServicio.classList.add("nombre-servicio");
    nombreServicio.textContent = nombre;

    const precioServicio = document.createElement("P");
    precioServicio.classList.add("precio-servicio");
    precioServicio.textContent = `$${precio}`;

    const servicioDiv = document.createElement("DIV");
    servicioDiv.classList.add("servicio");
    servicioDiv.dataset.idServicio = id;
    servicioDiv.onclick = () => {
      seleccionarServicio(servicio);
    };

    servicioDiv.appendChild(nombreServicio);
    servicioDiv.appendChild(precioServicio);

    document.querySelector("#servicios").appendChild(servicioDiv);
  });
}

function seleccionarServicio(servicio) {
  const { id } = servicio;
  const { servicios } = cita;

  // identificar al elemento que se le da click
  const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

  // comprobar si un servicio ya fue agregado o quitarlo
  if (servicios.some((agregado) => agregado.id === id)) {
    //eliminarlo
    cita.servicios = servicios.filter((agregado) => agregado.id !== id);
    divServicio.classList.remove("seleccionado");
  } else {
    //agregarlo
    cita.servicios = [...servicios, servicio];
    divServicio.classList.add("seleccionado");
  }
}

function nombreCliente() {
  cita.nombre = document.querySelector("#nombre").value;
}

function seleccionarFecha() {
  const inputFecha = document.querySelector("#fecha");
  inputFecha.addEventListener("input", (e) => {
    const dia = new Date(e.target.value).getUTCDay();

    if ([6, 0].includes(dia)) {
      e.target.value = "";
      mostrarAlerta("Fines de semana no permitidos", "error", ".formulario");
    } else {
      cita.fecha = e.target.value;
    }
  });
}

function configurarFechaMinima() {
  const inputFecha = document.querySelector("#fecha");
  const hoy = new Date().toISOString().split("T")[0]; // Formato 'YYYY-MM-DD'
  inputFecha.setAttribute("min", hoy);
}

function seleccionarHora() {
  const inputHora = document.querySelector("#hora");
  inputHora.addEventListener("input", (e) => {
    const horaCita = e.target.value;
    const hora = horaCita.split(":")[0];

    if (hora < 8 || hora >= 18) {
      e.target.value = "";
      mostrarAlerta("Hora no válida", "error", ".formulario");
    } else {
      cita.hora = e.target.value;
    }
  });
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {
  // se previene que se cree mas de una alerta
  const alertaPrevia = document.querySelector(".alerta");
  if (alertaPrevia) {
    alertaPrevia.remove();
  }

  // crear alerta
  const alerta = document.createElement("DIV");
  alerta.textContent = mensaje;
  alerta.classList.add("alerta");
  alerta.classList.add(tipo);

  const referencia = document.querySelector(elemento);
  referencia.appendChild(alerta);

  // eliminar alerta si esta como true
  if (desaparece) {
    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}

function mostrarResumen() {
  const resumen = document.querySelector(".contenido-resumen");

  // limpiar el contenido de resumen
  while (resumen.firstChild) {
    resumen.removeChild(resumen.firstChild);
  }

  if (Object.values(cita).includes("") || cita.servicios.length === 0) {
    mostrarAlerta(
      "Faltan datos de Servicios, Fecha u Hora",
      "error",
      ".contenido-resumen",
      false
    );
    return;
  }

  // Formatear el div de resumen
  const { nombre, fecha, hora, servicios } = cita;

  // heading para servicios en resumen
  const headingResumen = document.createElement("H3");
  headingResumen.textContent = "Resumen de Servicios";
  resumen.appendChild(headingResumen);

  // Iterando sobre los servicios para mostrarlos
  servicios.forEach((servicio) => {
    const { id, nombre, precio } = servicio;
    const contenedorServicio = document.createElement("DIV");
    contenedorServicio.classList.add("contenedor-servicio");

    const textoServicio = document.createElement("P");
    textoServicio.textContent = nombre;

    const precioServicio = document.createElement("P");
    precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

    contenedorServicio.appendChild(textoServicio);
    contenedorServicio.appendChild(precioServicio);

    resumen.appendChild(contenedorServicio);
  });

  // heading para cita en resumen
  const headingCita = document.createElement("H3");
  headingCita.textContent = "Resumen de Cita";
  resumen.appendChild(headingCita);

  const nombreCliente = document.createElement("P");
  nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

  // Formatear fecha
  const fechaObj = new Date(fecha);
  const mes = fechaObj.getMonth();
  const dia = fechaObj.getDate() + 2;
  const year = fechaObj.getFullYear();

  const fechaUTC = new Date(Date.UTC(year, mes, dia));

  const opciones = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const fechaFormateada = fechaUTC.toLocaleDateString("es-CO", opciones);

  const fechaCita = document.createElement("P");
  fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

  const horaCita = document.createElement("P");
  horaCita.innerHTML = `<span>Hora:</span> ${hora} horas`;

  // boton para reservar la cita
  const botonReservar = document.createElement("BUTTON");
  botonReservar.classList.add("boton");
  botonReservar.textContent = "Reservar Cita";
  botonReservar.onclick = reservarCita;

  resumen.appendChild(nombreCliente);
  resumen.appendChild(fechaCita);
  resumen.appendChild(horaCita);

  resumen.appendChild(botonReservar);
}

async function reservarCita() {
  // Obtener el token CSRF del formulario
  const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;
  // Obtener el valor del campo oculto de usuarioid y convertirlo a número
  const usuarioidElement = document.querySelector("[name=usuarioid]");
  //Obtener el id del usuario
  const usuarioid = parseInt(usuarioidElement.value, 10);
  //Obtener el id del servicio
  const servicioIds = cita.servicios.map((servicio) => servicio.id);

  // Recoger los datos del formulario
  const datos = {
    nombre: document.querySelector("#nombre").value,
    fecha: document.querySelector("#fecha").value,
    hora: document.querySelector("#hora").value,
    usuarioid: usuarioid,
    servicios: servicioIds,
  };

  try {
    // Enviar la solicitud POST
    const respuesta = await fetch(
      "http://127.0.0.1:8000/reservaciones/api/citas/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(datos),
      }
    );

    // Verificar si la respuesta es correcta
    if (!respuesta.ok) {
      const errorData = await respuesta.json();
      throw new Error(
        `HTTP error! status: ${respuesta.status}, details: ${JSON.stringify(
          errorData
        )}`
      );
    }

    // Procesar la respuesta si es correcta
    const resultado = await respuesta.json();

    if (resultado) {
      Swal.fire({
        icon: "success",
        title: "Cita Creada",
        text: "Tu cita fue creada correctamente",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.reload();
      });
    }

    // Aquí podrías realizar alguna acción adicional, como redirigir al usuario o mostrar un mensaje de éxito
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ocurrió un error al crear la cita. Por favor, inténtalo de nuevo.",
      confirmButtonText: "OK",
    }).then(() => {
      window.location.reload();
    });
  }
}

function logout() {
  const logoutForm = document.getElementById("logout-form");

  // Obtener el token CSRF del formulario
  const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;

  if (logoutForm) {
    logoutForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Previene el comportamiento por defecto del formulario

      fetch(logoutForm.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Establece el tipo de contenido
          "X-CSRFToken": csrfToken,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error en la solicitud");
          }
          return response.json();
        })
        .then((data) => {
          // Muestra el mensaje recibido en la respuesta JSON usando SweetAlert2
          Swal.fire({
            icon: "success",
            title: "Sesión Cerrada",
            text: data.message, // Usa el mensaje recibido del backend
            confirmButtonText: "OK",
          }).then(() => {
            // Redirige a otra página después de que el usuario cierre la alerta
            window.location.href = "/"; // Redirige a la página de inicio o cualquier otra página
          });
        })
        .catch((error) => {
          // Muestra el mensaje de error usando SweetAlert2
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un error al cerrar sesión. Intenta de nuevo.",
            confirmButtonText: "OK",
          });
          console.error("Error:", error);
        });
    });
  }
}
