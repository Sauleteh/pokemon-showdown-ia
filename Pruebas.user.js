(function() {
    'use strict';

    // Your code here...
	// Adición de la API PokéAPI
	var pokeApi = document.createElement("script");
	pokeApi.setAttribute("src", "https://unpkg.com/pokeapi-js-wrapper/dist/index.js");
	document.head.appendChild(pokeApi);

	let P = null; // La Pokédex de PokéAPI

	let idAutoLogin = null;
	let idIA = null;
	let idCheckBox = null;
	let cbChecked = false;
	let tipos = { usuario: [], enemigo: [] }; // Tipos de los dos Pokémon en combate
	let pokeUser = ""; // Nombre del Pokémon en combate del usuario
	let pokeEnem = ""; // Nombre del Pokémon en combate del enemigo
	let pokesReserva = {type: [], value: [], name: [] } // Pokémon en reserva por parte del usuario (el primer elemento de type es el nombre del Pokémon debido a que los tipos se añaden de forma asíncrona)
	let numPokesReserva = 0; // Número para saber si ya se consiguieron todos los Pokémon en reserva

	const tablaTipos = {
		bug: {
			bug: 1,
			dark: 1,
			dragon: 1,
			electric: 1,
			fairy: 1,
			fighting: 0.5,
			fire: 2,
			flying: 2,
			ghost: 1,
			grass: 0.5,
			ground: 0.5,
			ice: 1,
			normal: 1,
			poison: 1,
			psychic: 1,
			rock: 2,
			steel: 1,
			water: 1
		},
		dark: {
			bug: 2,
			dark: 0.5,
			dragon: 1,
			electric: 1,
			fairy: 2,
			fighting: 2,
			fire: 1,
			flying: 1,
			ghost: 0.5,
			grass: 1,
			ground: 1,
			ice: 1,
			normal: 1,
			poison: 1,
			psychic: 0,
			rock: 1,
			steel: 1,
			water: 1
		},
		dragon: {
			bug: 1,
			dark: 1,
			dragon: 2,
			electric: 0.5,
			fairy: 2,
			fighting: 1,
			fire: 0.5,
			flying: 1,
			ghost: 1,
			grass: 0.5,
			ground: 1,
			ice: 2,
			normal: 1,
			poison: 1,
			psychic: 1,
			rock: 1,
			steel: 1,
			water: 0.5
		},
		electric: {
			bug: 1,
			dark: 1,
			dragon: 1,
			electric: 0.5,
			fairy: 1,
			fighting: 1,
			fire: 1,
			flying: 0.5,
			ghost: 1,
			grass: 1,
			ground: 2,
			ice: 1,
			normal: 1,
			poison: 1,
			psychic: 1,
			rock: 1,
			steel: 0.5,
			water: 1
		},
		fairy: {
			bug: 0.5,
			dark: 0.5,
			dragon: 0,
			electric: 1,
			fairy: 1,
			fighting: 0.5,
			fire: 1,
			flying: 1,
			ghost: 1,
			grass: 1,
			ground: 1,
			ice: 1,
			normal: 1,
			poison: 2,
			psychic: 1,
			rock: 1,
			steel: 2,
			water: 1
		},
		fighting: {
			bug: 0.5,
			dark: 0.5,
			dragon: 1,
			electric: 1,
			fairy: 2,
			fighting: 1,
			fire: 1,
			flying: 2,
			ghost: 1,
			grass: 1,
			ground: 1,
			ice: 1,
			normal: 1,
			poison: 1,
			psychic: 2,
			rock: 0.5,
			steel: 1,
			water: 1
		},
		fire: {
			bug: 0.5,
			dark: 1,
			dragon: 1,
			electric: 1,
			fairy: 0.5,
			fighting: 1,
			fire: 0.5,
			flying: 1,
			ghost: 1,
			grass: 0.5,
			ground: 2,
			ice: 0.5,
			normal: 1,
			poison: 1,
			psychic: 1,
			rock: 2,
			steel: 0.5,
			water: 2
		},
		flying: {
			bug: 0.5,
			dark: 1,
			dragon: 1,
			electric: 2,
			fairy: 1,
			fighting: 0.5,
			fire: 1,
			flying: 1,
			ghost: 1,
			grass: 0.5,
			ground: 0,
			ice: 2,
			normal: 1,
			poison: 1,
			psychic: 1,
			rock: 2,
			steel: 1,
			water: 1
		},
		ghost: {
			bug: 0.5,
			dark: 2,
			dragon: 1,
			electric: 1,
			fairy: 1,
			fighting: 0,
			fire: 1,
			flying: 1,
			ghost: 2,
			grass: 1,
			ground: 1,
			ice: 1,
			normal: 0,
			poison: 0.5,
			psychic: 1,
			rock: 1,
			steel: 1,
			water: 1
		},
		grass: {
			bug: 2,
			dark: 1,
			dragon: 1,
			electric: 0.5,
			fairy: 1,
			fighting: 1,
			fire: 2,
			flying: 2,
			ghost: 1,
			grass: 0.5,
			ground: 0.5,
			ice: 2,
			normal: 1,
			poison: 2,
			psychic: 1,
			rock: 1,
			steel: 1,
			water: 0.5
		},
		ground: {
			bug: 1,
			dark: 1,
			dragon: 1,
			electric: 0,
			fairy: 1,
			fighting: 1,
			fire: 1,
			flying: 1,
			ghost: 1,
			grass: 2,
			ground: 1,
			ice: 2,
			normal: 1,
			poison: 0.5,
			psychic: 1,
			rock: 0.5,
			steel: 1,
			water: 2
		},
		ice: {
			bug: 1,
			dark: 1,
			dragon: 1,
			electric: 1,
			fairy: 1,
			fighting: 2,
			fire: 2,
			flying: 1,
			ghost: 1,
			grass: 1,
			ground: 1,
			ice: 0.5,
			normal: 1,
			poison: 1,
			psychic: 1,
			rock: 2,
			steel: 2,
			water: 1
		},
		normal: {
			bug: 1,
			dark: 1,
			dragon: 1,
			electric: 1,
			fairy: 1,
			fighting: 2,
			fire: 1,
			flying: 1,
			ghost: 0,
			grass: 1,
			ground: 1,
			ice: 1,
			normal: 1,
			poison: 1,
			psychic: 1,
			rock: 1,
			steel: 1,
			water: 1
		},
		poison: {
			bug: 0.5,
			dark: 1,
			dragon: 1,
			electric: 1,
			fairy: 0.5,
			fighting: 0.5,
			fire: 1,
			flying: 1,
			ghost: 1,
			grass: 0.5,
			ground: 2,
			ice: 1,
			normal: 1,
			poison: 0.5,
			psychic: 2,
			rock: 1,
			steel: 1,
			water: 1
		},
		psychic: {
			bug: 2,
			dark: 2,
			dragon: 1,
			electric: 1,
			fairy: 1,
			fighting: 0.5,
			fire: 1,
			flying: 1,
			ghost: 2,
			grass: 1,
			ground: 1,
			ice: 1,
			normal: 1,
			poison: 1,
			psychic: 0.5,
			rock: 1,
			steel: 1,
			water: 1
		},
		rock: {
			bug: 1,
			dark: 1,
			dragon: 1,
			electric: 1,
			fairy: 1,
			fighting: 2,
			fire: 0.5,
			flying: 0.5,
			ghost: 1,
			grass: 2,
			ground: 2,
			ice: 1,
			normal: 0.5,
			poison: 0.5,
			psychic: 1,
			rock: 1,
			steel: 2,
			water: 2
		},
		steel: {
			bug: 0.5,
			dark: 1,
			dragon: 0.5,
			electric: 1,
			fairy: 0.5,
			fighting: 2,
			fire: 2,
			flying: 0.5,
			ghost: 1,
			grass: 0.5,
			ground: 2,
			ice: 0.5,
			normal: 0.5,
			poison: 0,
			psychic: 0.5,
			rock: 0.5,
			steel: 0.5,
			water: 1
		},
		water: {
			bug: 1,
			dark: 1,
			dragon: 1,
			electric: 2,
			fairy: 1,
			fighting: 1,
			fire: 0.5,
			flying: 1,
			ghost: 1,
			grass: 2,
			ground: 1,
			ice: 0.5,
			normal: 1,
			poison: 1,
			psychic: 1,
			rock: 1,
			steel: 0.5,
			water: 0.5
		}
	};
	// ---------- PRUEBAS ----------
	//const collection = document.getElementsByClassName("type-Dark has-tooltip");
	//console.log("Waited 1s");
	//alert("hola");
	//console.log(collection[0]);
	//collection[0].click();
	// ---------- PRUEBAS ----------

	clearInterval(idAutoLogin);
	idAutoLogin = setInterval(autoLogin, 200); // Comienzo de adición de botón de auto login

	clearInterval(idCheckBox);
	idCheckBox = setInterval(checkBoxIA, 2000);

	// Función para añadir los botones de auto login
	function autoLogin()
	{
		// Mientras aún no haya cargado el botón de iniciar sesión, esperar hasta que cargue
		if (document.querySelector('div.userbar > button[name="login"]') !== null)
		{
			console.log("Login cargado, procediendo a añadir handler...")

			// Una vez cargado el botón, al hacer click añadimos dos botones a la derecha del menú
			document.querySelector('div.userbar > button[name="login"]').addEventListener("click", function()
			{
				setTimeout(function() {
					var autoLogin1 = document.createElement("button");
					autoLogin1.innerHTML = "Auto Login P1";
					autoLogin1.addEventListener("click", function() {
						// Al hacer click en este nuevo botón, añadimos el usuario y se hace login automáticamente
						document.querySelector("input.textbox").value = "Rand23478234789";
					});
					document.querySelector("p.buttonbar").appendChild(autoLogin1);

					var autoLogin2 = document.createElement("button");
					autoLogin2.innerHTML = "Auto Login P2";
					autoLogin2.addEventListener("click", function() {
						// Al hacer click en este nuevo botón, añadimos el usuario y se hace login automáticamente
						document.querySelector("input.textbox").value = "Rand4781278914";
					});
					document.querySelector("p.buttonbar").appendChild(autoLogin2);
				}, 200);
			});
			clearInterval(idAutoLogin);
		}
		else console.log("Login aún en carga...");
	}

	// Función para colocar el activador de inteligencia artificial en el combate
	function checkBoxIA()
	{
		if (document.querySelector("div.controls") !== null && document.querySelector('input#cbIA') === null)
		{
			//console.log("Combate detectado, habilitando opción para activar combate por IA...");

			// Divisor para el checkbox
			var divIA = document.createElement("div");
			divIA.setAttribute("id", "divIA");
			document.querySelector("div.controls").appendChild(divIA);

			// El checkbox
			var cb = document.createElement("INPUT");
			cb.setAttribute("id", "cbIA");
			cb.setAttribute("type", "checkbox");
			cb.addEventListener("change", function()
			{
				if (this.checked)
				{
					idIA = setInterval(pokeIA, 2000);
					cbChecked = true;
				}
				else
				{
					cbChecked = false;
					clearInterval(idIA);
				}
			});
			cb.checked = cbChecked;
			document.querySelector("div#divIA").appendChild(cb);

			// La label que acompaña al checkbox
			var p = document.createElement("label");
			p.setAttribute("for", "cbIA");
			p.innerHTML = "Activar inteligencia artificial";
			document.querySelector("div#divIA").appendChild(p);
		}
	}

	// Función para jugar automáticamente por IA, se ejecuta cada 2 segs
	function pokeIA()
	{
		if (P === null)
		{
			P = new Pokedex.Pokedex(); // Obtenemos la Pokédex de PokéAPI (solo una vez)
		}

		setTimeout(getPokemonName("usuario"), 1); // Guardar el tipo del Pokémon usuario
		setTimeout(getPokemonName("enemigo"), 100); // y enemigo

		if (pokeUser !== "" && pokeEnem !== "")
		{
			P.getPokemonByName(pokeUser).then(function (response) {
				// Obtener los tipos del Pokémon usuario
				for (var i = 0; i < response.types.length; i++) {
					tipos.usuario.push(response.types[i].type.name.toString());
				}

				// Conseguir los tipos del Pokémon enemigo
				P.getPokemonByName(pokeEnem).then(function (response) {
					for (var i = 0; i < response.types.length; i++) {
						tipos.enemigo.push(response.types[i].type.name.toString());
					}

					// Mostrar los tipos detectados
					console.log("Tipos de los Pokémon en combate: " + tipos.usuario + " | " + tipos.enemigo);

					// Si estamos en ventaja o neutralidad de tipos, intentar usar movimientos (neutralidad también se aplica a ventaja de tipos por ambas partes)
					// Para esto, comprobamos las 4 posibles ventajas de tipo (1er y 2o tipo usuario VS 1er y 2o tipo enemigo)
					let ventajaTipo = 1;
					for (var i = 0; i < tipos.usuario.length; i++)
					{
						for (var j = 0; j < tipos.enemigo.length; j++)
						{
							ventajaTipo *= tablaTipos[tipos.enemigo[j]][tipos.usuario[i]];
						}
					}
					console.log(ventajaTipo);

					if (ventajaTipo >= 1)
					{
						let movimientos = getUserMoves(); // Conseguir los movimientos de ataque
						let mejorOpcion = getBestOptionMove(movimientos); // Analizar la mejor opción
						
						if (mejorOpcion.eff >= 1) // Usar la mejor opción si es mínimamente útil
						{
							try { document.querySelector('div.movemenu > button.has-tooltip[value="' + movimientos.value[mejorOpcion.index] + '"]').click(); }
							catch (error) { console.log("Esperando decisión del rival..."); }
						}
						else procesaCambioPokemon(); // Si no sirve de mucho la mejor opción, lo mejor será cambiar de Pokémon
					}
					else
					{
						// Si estamos en desventaja de tipos, intentamos cambiar de Pokémon
						getAllPokemonSwitch(); // Conseguir los tipos de los Pokémon en reserva vivos
						if (pokesReserva.name.length === numPokesReserva) // Esperamos a conseguir los Pokémon en reserva
						{
							for (var i = 0; i < numPokesReserva; i++)
							{
								P.getPokemonByName(pokesReserva.name[i]).then(function (response) {
									let tipos = [];
									tipos.push(response.name);
									for (var j = 0; j < response.types.length; j++) {
										tipos.push(response.types[j].type.name.toString());
									}
									pokesReserva.type.push(tipos);
								}).catch((error) => {
									// Si ocurre un error (un Pokémon que no existe en la API), desactivar la IA
									document.querySelector("input#cbIA").checked = false;
									cbChecked = false;
									console.error("Error en los datos del Pokémon en reserva: " + error);
									tipos = { usuario: [], enemigo: [] };
									pokeUser = "";
									pokeEnem = "";
									pokesReserva = {type: [], value: [], name: [] };
									numPokesReserva = 0;
									clearInterval(idIA);
								});
							}
							if (pokesReserva.type.length === numPokesReserva)
							{
								console.log(pokesReserva);
								// Analizar la mejor opción
								let mejorOpcion = getBestOptionSwitch();
								console.log(mejorOpcion);
								// Cambiar a la mejor opción si es mínimamente útil
								if (mejorOpcion.eff >= 1)
								{
									try { document.querySelector('div.switchmenu > button[name="chooseSwitch"][value="' + mejorOpcion.index + '"]').click(); }
									catch (error) { console.log("Esperando decisión del rival..."); }
								}
								else
								{
									// Si no sirve de mucho cambiar a la mejor opción, lo mejor será realizar un movimiento
									let movimientos = getUserMoves(); // Conseguir los movimientos de ataque
									let mejorOpcion = getBestOptionMove(movimientos); // Analizar la mejor opción
									
									try { document.querySelector('div.movemenu > button.has-tooltip[value="' + movimientos.value[mejorOpcion.index] + '"]').click(); }
									catch (error) { console.log("Esperando decisión del rival..."); }
								}
							}
							pokesReserva = {type: [], value: [], name: [] };
							numPokesReserva = 0;
						}
					}

					tipos = { usuario: [], enemigo: [] };
					pokeUser = "";
					pokeEnem = "";
				}).catch((error) => {
					// Si ocurre un error (un Pokémon que no existe en la API), desactivar la IA
					document.querySelector("input#cbIA").checked = false;
					cbChecked = false;
					console.error("Error en los datos del Pokémon enemigo: " + error);
					tipos = { usuario: [], enemigo: [] };
					pokeUser = "";
					pokeEnem = "";
					pokesReserva = {type: [], value: [], name: [] };
					numPokesReserva = 0;
					clearInterval(idIA);
				});
			}).catch((error) => {
				// Si ocurre un error (un Pokémon que no existe en la API), desactivar la IA
				document.querySelector("input#cbIA").checked = false;
				cbChecked = false;
				console.error("Error en los datos del Pokémon usuario: " + error);
				tipos = { usuario: [], enemigo: [] };
				pokeUser = "";
				pokeEnem = "";
				pokesReserva = {type: [], value: [], name: [] };
				numPokesReserva = 0;
				clearInterval(idIA);
			});
		}
	}

	/**
	 * Método que procesa el cambio de Pokémon tanto como si muere el Pokémon como si se
	 * quiere cambiar ya que ningún movimiento es mínimamente efectivo
	 */
	function procesaCambioPokemon()
	{
		getAllPokemonSwitch(); // Conseguir los tipos de los Pokémon en reserva vivos
		if (pokesReserva.name.length === numPokesReserva) // Esperamos a conseguir los Pokémon en reserva
		{
			for (var i = 0; i < numPokesReserva; i++)
			{
				P.getPokemonByName(pokesReserva.name[i]).then(function (response) {
					let tipos = [];
					tipos.push(response.name);
					for (var j = 0; j < response.types.length; j++)
					{
						tipos.push(response.types[j].type.name.toString());
					}
					pokesReserva.type.push(tipos);
				}).catch((error) => {
					// Si ocurre un error (un Pokémon que no existe en la API), desactivar la IA
					document.querySelector("input#cbIA").checked = false;
					cbChecked = false;
					console.log("Error en los datos del Pokémon en reserva: " + error);
					tipos = { usuario: [], enemigo: [] };
					pokeUser = "";
					pokeEnem = "";
					pokesReserva = { type: [], value: [], name: [] };
					numPokesReserva = 0;
					clearInterval(idIA);
				});
			}
			if (pokesReserva.type.length === numPokesReserva)
			{
				console.log(pokesReserva);
				// Analizar la mejor opción
				let mejorOpcion = getBestOptionSwitch();
				console.log(mejorOpcion);

				try { document.querySelector('div.switchmenu > button[name="chooseSwitch"][value="' + mejorOpcion.index + '"]').click(); }
				catch (error) { console.log("Esperando decisión del rival..."); }
			}
			pokesReserva = { type: [], value: [], name: [] };
			numPokesReserva = 0;
		}
	}

	//// * FUNCIONES AUXILIARES * ////

	/**
	 * Función que extrae el nombre normalizado del Pokémon con la burbuja activada para la API
	 * @param {*} side es el lado del campo: "usuario" para el Pokémon del usuario, "enemigo" para el Pokémon del enemigo y cualquier otro valor para el Pokémon en reserva
	 */
	function getNormalizedName(side) {
		var nombre = "";
		let panel;
		if (side === "usuario" || side === "enemigo") panel = document.querySelector('div#tooltipwrapper > div.tooltipinner > div.tooltip-activepokemon > h2');
		else panel = document.querySelector('div#tooltipwrapper > div.tooltipinner > div.tooltip-switchpokemon > h2');
		// Se comprueba si tiene nombre especial
		try
		{
			if (panel.children[0].nodeName === "SMALL" && panel.children[0].innerHTML.charAt(0) === '(') // Si el primer elemento de la cabecera es small, quiere decir que tiene nombre especial
			{
				nombre = panel.children[0].innerHTML;
				nombre = nombre.substring(1, nombre.length) // Se borra el primer caracter porque es un paréntesis
			}
			else // Si no tiene nombre especial, nos quedamos con el nombre por defecto
			{
				let pos = 0; // Ir caracter por caracter hasta detectar el nombre completo del Pokémon
				while (panel.innerHTML[pos] !== '<' || pos > 60) nombre += panel.innerHTML[pos++];
			}
			nombre = nombre.substring(0, (nombre[nombre.length - 1] === " " || nombre[nombre.length - 1] === ")") ? nombre.length - 1 : nombre.length).toLowerCase() // Se borra el último caracter debido a que es un paréntesis (especial) o espacio en blanco (normal)
			nombre = analizarNombre(nombre); // Hay Pokémon que en la API tienen su nombre normalizado de otra forma
			console.log(nombre);
			if (side === "usuario") pokeUser = nombre;
			else if (side === "enemigo") pokeEnem = nombre;
			else
			{
				pokesReserva.name.push(nombre); // Metemos el nombre en el array de nombres
				pokesReserva.value.push(side); // Metemos el índice en el array de índices
			}
		}
		catch (error) { procesaCambioPokemon(); } // Si ocurre un error en la ejecución significa que no se pudo conseguir el nombre del Pokémon porque está muerto, por tanto procesar el cambio de Pokémon
	}

	/** Simular evento de pasar ratón por encima del Pokémon que se desee para obtener sus datos
	 * @param side es el lado del campo, teniendo las opciones siguientes: "usuario" para el Pokémon usuario, "enemigo" para el Pokémon
	 * enemigo o cualquier otro valor para el Pokémon en reserva indicado por el side que se tomaría como el índice del html 
	 */
	function getPokemonName(side)
	{
		const ev = new MouseEvent("mouseover", {bubbles: true, clientX: 0, clientY: 0}); // Simular "poner el ratón por encima"

		// Conseguir el html requerido
		let poke;
		if (side === "usuario") poke = document.querySelector('div.tooltips > div.has-tooltip[data-id="p1a"]');
		else if (side === "enemigo") poke = document.querySelector('div.tooltips > div.has-tooltip[data-id="p2a"]');
		else poke = document.querySelector('div.switchmenu > button[name="chooseSwitch"][value="' + side + '"]');

		poke.dispatchEvent(ev); // Ejecutar simulación de ratón
		setTimeout(getNormalizedName(side), 50); // Conseguir el nombre normalizado
	}

	/**
	 * Obtener los movimientos de ataque del Pokémon usuario
	 * @returns los movimientos con un mínimo de daño base. El primer elemento es el tipo del ataque y el segundo es el índice en el html
	 */
	function getUserMoves()
	{
		let movesAtaque = { type: [], value: [] };
		
		let movesSinProcesar = document.querySelectorAll('div.movemenu > button.has-tooltip[data-target="normal"], div.movemenu > button.has-tooltip[data-target="allAdjacent"], div.movemenu > button.has-tooltip[data-target="allAdjacentFoes"]');
		for (var i = 0; i < movesSinProcesar.length; i++)
		{
			movesAtaque.type.push(movesSinProcesar[i].className.split(" ")[0].split("-")[1].toLowerCase());
			movesAtaque.value.push(movesSinProcesar[i].value);
		}
		return movesAtaque;
	}

	/**
	 * Función que selecciona el mejor movimiento según los tipos del enemigo y los movimientos que se posean
	 * @param {*} moves es el array de movimientos
	 * @returns la mejor opción en forma de array de dos elementos: el primero es el índice del mejor movimiento y el segundo es la eficiencia de este movimiento contra el enemigo
	 */
	function getBestOptionMove(moves)
	{
		let bestOption = { index: 0, eff: 0 };
		for (var i = 0; i < moves.type.length; i++)
		{
			let eff = 1;
			for (var j = 0; j < tipos.enemigo.length; j++)
			{
				eff *= tablaTipos[tipos.enemigo[j]][moves.type[i]];
			}

			if (eff > bestOption.eff)
			{
				bestOption.index = i;
				bestOption.eff = eff;
			}
			console.log("Move eff " + i + ": " + eff);
		}
		return bestOption;
	}

	/**
	 * Función que selecciona el mejor Pokémon en reserva según los tipos del enemigo
	 * @returns la mejor opción en forma de array de dos elementos: el primero es el índice del Pokémon en reserva para el html y el segundo es la eficiencia del cambio contra el enemigo
	 */
	function getBestOptionSwitch()
	{
		let bestOption = { index: 0, eff: 0 };
		for (var i = 0; i < pokesReserva.type.length; i++)
		{
			let eff = 1;
			for (var j = 0; j < tipos.enemigo.length; j++)
			{
				for (var k = 1; k < pokesReserva.type[i].length; k++)
				{
					eff *= tablaTipos[tipos.enemigo[j]][pokesReserva.type[i][k]];
				}
			}

			if (eff > bestOption.eff)
			{
				bestOption.index = pokesReserva.value[pokesReserva.name.indexOf(pokesReserva.type[i][0])];
				bestOption.eff = eff;
			}
			console.log("Reserva eff " + i + ": " + eff);
		}
		return bestOption;
	}

	/**
	 * Función que analiza los Pokémon en reserva del usuario para meterlos en el array definida al principio del programa
	 */
	function getAllPokemonSwitch()
	{
		let pokesSinProcesar = document.querySelectorAll('div.switchmenu > button[name="chooseSwitch"]');
		numPokesReserva = pokesSinProcesar.length;

		for (var i = 0; i < numPokesReserva; i++)
		{
			setTimeout(getPokemonName(pokesSinProcesar[i].value), (i + 2) * 100);
		}
	}

	/**
	 * Comprobar que el nombre normalizado corresponde con el de la API
	 * @param {*} name es el nombre normalizado del Pokémon que se quiere analizar
	 * @returns el nombre normalizado según la API
	 */
	function analizarNombre(name)
	{
		if (name === "tornadus" || name === "thundurus" || name === "landorus" || name === "enamorus") return name + "-incarnate";
		if (name === "iron treads" || name === "iron bundle" || name === "iron hands" || name === "iron jugulis" ||
			name === "iron moth" || name === "iron thorns" || name === "iron valiant" || name === "iron leaves" ||
			name === "walking wake" || name === "great tusk" || name === "slither wing" || name === "brute bonnet" ||
			name === "tapu koko") return name.split(" ").join("-");
		if (name === "indeedee") return name + "-male";
		if (/^pikachu-\S.*$/.test(name)) return name + "-cap";
		if (name === "eiscue") return name + "-ice";
		if (name === "urshifu") return name + "-single-strike";
		if (name === "lycanroc") return name + "-midday";
		if (name === "basculegion-f") return name + "emale";
		if (name === "basculegion-m") return name + "ale";
		if (name === "silvally-grass") return "silvally";

		return name;
	}
})();