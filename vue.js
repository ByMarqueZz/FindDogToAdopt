window.onload = function () {
    const { createApp } = Vue;

    createApp({
        data() {
            return {
                start: false,
                buttonDisabled: false,
                objetoXML: null,
                razaElegida: "",
                page: 2,
                token: "",
                objetoPerros: [],
            }
        },
        methods: {
            cabecera() {
                var jdata = new Object();
                jdata.grant_type = "client_credentials";
                jdata.client_id = "TcwSrYYl9VhFboIlvAPpOcTw2s73FZs0kzVODJar1VytGL3W7R";
                jdata.client_secret = "Dsa1bacREBHc6uCfPVNMdgPgjySiyCj54bRzTrc4";
                httpRequest = new XMLHttpRequest();
                httpRequest.open("POST", "https://api.petfinder.com/v2/oauth2/token", true);
                httpRequest.setRequestHeader('Content-Type', 'application/json');
                httpRequest.send(JSON.stringify(jdata));
                
                httpRequest.onreadystatechange = this.tratoCabecera;                  
            },
            tratoCabecera() {
                if (httpRequest.readyState === 4) {
                    if (httpRequest.status === 200) {
                        var respuesta = JSON.parse(httpRequest.responseText);
                        console.log(respuesta.access_token);
                        this.token = respuesta.access_token;
                        this.buttonDisabled = true;
                        this.peticionRazas();
                    }
                }
            },
            peticionRazas() {
                httpRequest = new XMLHttpRequest();
                httpRequest.open("GET", "https://api.petfinder.com/v2/types/dog/breeds", true);
                httpRequest.setRequestHeader("Authorization", "Bearer " + this.token);
                httpRequest.onreadystatechange = this.trateRespuestaRazas;
                httpRequest.send();
            },
            trateRespuestaRazas() {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    if (httpRequest.status === 200) {
                        var objetoXML = JSON.parse(httpRequest.responseText);
                        
                        this.objetoXML = objetoXML;
                        // this.start = true;
                        console.log(this.objetoXML);
                    } else if (httpRequest.status === 400 || httpRequest === 401) {
                        this.cabecera();
                    }
                }
            },
            eventoBoton() {
                this.peticion(this.token, this.page, this.razaElegida);
            },
            peticion(token, page, raza) {
                httpRequest.open("GET", "https://api.petfinder.com/v2/animals?type=dog&breed=" + raza + "&page=" + page, true);
                httpRequest.setRequestHeader("Authorization", "Bearer " + token);
                httpRequest.onreadystatechange = this.trateRespuesta;
                httpRequest.send();
            },
            trateRespuesta() {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    if (httpRequest.status === 200) {
                        this.objetoPerros = JSON.parse(httpRequest.responseText).animals;
                        console.log(this.objetoPerros);
                        this.start = true;
                        }
                    } else if (httpRequest.status === 400 || httpRequest === 401) {
                        cabecera();
                        this.paginas = false;
                    }
            },
        },
        computed: {

        },
        beforeMount() {
            this.cabecera();
        }
    }).mount('#app')
}