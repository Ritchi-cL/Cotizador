// Constructores 
function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

/*  
    Realiza la cotización con los datos
    En este prototype la función no es flecha porque se necesita acceder
    A los datos del objeto
*/ 
Seguro.prototype.cotizarSeguro = function() {
/*
    1 = Americano 1.15
    2 = Asiático 1.05
    3 = Europeo 1.35
*/

    let cantidad;
    const base = 25990;
    
    switch (this.marca) {
        case "1":
            cantidad = base * 1.15;
            break;

        case "2":
            cantidad = base * 1.05;
            break;

        case "3":
            cantidad = base * 1.35;
            break;
    }

    /*
        Leer el año
        Con cada año la diferencia será mayor, el costo va a reducirse en un 3%
    */

    const diferencia = new Date().getFullYear() - this.year;

    // Se reduce el costo en un 3%

    cantidad -= ((diferencia * 3)) * cantidad / 100;

    console.log(cantidad);

    /*
        Si el seguro es básico se multiplica por un 30% más
        Si el seguro es completo se multiplica por un 50% más
    */

    if (this.tipo === "basico") {
        cantidad *= 1.30;
    } else {
        cantidad *= 1.50;
    }

    return cantidad;
}

function UI() {
    
}

// Llenar las opciones de los años
UI.prototype.llenarOpciones = () => {
    // Obtener el año actual como "max"
    const max = new Date().getFullYear(),
            // El año mínimo será igual al máximo - 20
            min = max - 20;

    const selectYear = document.querySelector("#year");

    for (let i = max; i > min; i--) {
        // Recorriendo el "i" creará las opciones de años
        let option = document.createElement("option");
        // Se le da el valor de "i" a las opciones
        option.value = i;
        // Se le asigna el texto de "i" a las opciones
        option.textContent = i;
        // Se agrega al HTML las opciones de años
        selectYear.appendChild(option);
        
    }
}

/*
    A la clase UI se le agrega el prototype "muestraAlertas" que toma un mensaje y tipo
    "mensaje" y "tipo" vienen de la función cotizarSeguro()
*/ 
UI.prototype.mostrarAlertas = (mensaje, tipo) => {

    const div = document.createElement("div");
    
    if (tipo === "error") {
        div.classList.add("error");
    } else {
        div.classList.add("correcto");
    }

    // Agregar la clase "mensaje" y "mt-10"
    div.classList.add("mensaje", "mt-10");
    // Colocar el texto del mensaje
    div.textContent = mensaje;

    // Insertar el div en el HTML
    const formulario = document.querySelector("#cotizar-seguro");
    // inserBefore solicita lo que se agregará, y luego una referencia
    // Se agregará el "div" en "resultado"
    formulario.insertBefore(div, document.querySelector("#resultado"));

    setTimeout(() => {

        div.remove();
    }, 3000)
}

/*
    A la clase UI se le agrega el prototype "mostrarResultado" que toma dos parámetros
    "seguro" y "total" que vienen de la función cotizarSeguro()
*/ 
UI.prototype.mostrarResultado = (total, seguro) => {

    // Aplicando Destructuring a "seguro" se extrae marca, year y tipo del objeto "seguro"
    const {marca, year, tipo} = seguro;

    let textoMarca;

    switch (marca) {
        case "1":
            textoMarca = "Americano";
            break;

        case "2":
            textoMarca = "Asiatico";
            break;

        case "3":
            textoMarca = "Europeo";
            break;
    }

    // Crear el resultado
    const div = document.createElement("div");
    div.classList.add("mt-10");
    /*
        textContent cuando no queremos agregar HTML
        innetHTML cuando queremos agregar HTML
    */
    div.innerHTML = `
        <p class='header'>Tu resumen</p>
        <p class='font-bold'>Marca: <span class='font-normal'>${textoMarca}</span></p>
        <p class='font-bold'>Año: <span class='font-normal'>${year}</span></p>
        <p class='font-bold'>Tipo de seguro: <span class='font-normal capitalize'>${tipo}</span></p>
        <p class='font-bold'>Total: <span class='font-normal'>$${total}</span></p>
        
    `;

    const resultadoDiv = document.querySelector("#resultado");
    

    // Mostrar el spinner
    const spinner = document.querySelector("#cargando");
    spinner.style.display = "block";

    setTimeout(() => {
        // Se borra el spinner
        spinner.style.display = "none";
        // Se agrega el resultado
        resultadoDiv.appendChild(div);
    }, 3000)
}

// Instanciar UI
const interfazUsuario = new UI();
console.log(interfazUsuario);

document.addEventListener("DOMContentLoaded", () => {
    // Llenar el select con los años
    interfazUsuario.llenarOpciones();
});

// Llamar al eventListeners
eventListeners();

function eventListeners() {
    // Seleccionar el formulario HTML de id "cotizar-seguro"
    const formulario = document.querySelector("#cotizar-seguro");
    // Escuchar al formulario al presionar "submit"
    formulario.addEventListener("submit", cotizarSeguro);
}

function cotizarSeguro(event) {
    // Prevenir el submit por default del botón
    event.preventDefault();

    // Leer la marca seleccionada
    const marcaSeguro = document.querySelector("#marca").value; 
    
    // Leer el año seleccionado
    const yearSeleccionado = document.querySelector("#year").value;

    // Leer el tipo de cobertura de seguro
    const cobertura = document.querySelector("input[name='tipo']:checked").value;

    if (marcaSeguro === "" || yearSeleccionado === "" || cobertura === "") {
        interfazUsuario.mostrarAlertas("Todos los campos son obligatorios", "error");
        return;
    }

    interfazUsuario.mostrarAlertas("Cotizando...", "exito");

    // Ocultar las cotizaciones previas
    const resultados = document.querySelector("#resultado div");

    if (resultados != null) {
        resultados.remove();
    }


    // Instanciar el seguro
    const seguro = new Seguro(marcaSeguro, yearSeleccionado, cobertura);
    const total = seguro.cotizarSeguro();

    //
    interfazUsuario.mostrarResultado(total, seguro); 
}