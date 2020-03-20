/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/* Esta es la página principal, usenla para probar sus componenetes, la idea es que aquí se hagan las modificaciones en
 * memoria y se envien datos a los componentes. El código actualmente está con un ejemplo del listado de cursos */

import { LitElement, html, css, property, PropertyValues, customElement } from 'lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { installOfflineWatcher } from 'pwa-helpers/network.js';
import { installRouter } from 'pwa-helpers/router.js';
import { updateMetadata } from 'pwa-helpers/metadata.js';
import { store, RootState } from '../store.js';
import { customCss } from './style';

// Importen sus tipos de datos y funciones
import { getAllCursos } from '../actions/cursos';

// These are the actions needed by this element.
import {
  navigate,
  updateOffline,
  updateDrawerState
} from '../actions/app.js';

import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import './snack-bar.js';

// Aqui se importan los componentes.
import './horario-clases';

@customElement('side-menu')
export class SideMenu extends connect(store)(LitElement) {

  @property({type: String})
  private _page: string = '';

  @property({type: String})
  public _active: string = '';

  @property({type: String})
  public _busqueda: string = '';

  @property({type: Object})
  public pageCall: any;

  private appTitle : string = 'Siga';

  static get styles() {
    return [customCss,
      css`

        @keyframes fadeIn {
          from {opacity: 0.0;}
          to   {opacity 1.0;}
        }
        @keyframes fadeOut {
          from {opacity: 1.0;}
          to   {opacity: 0.0;}
        }

        .menu {
          background: #FABA25;
          color: white;
          display: flex;
          flex-flow: column nowrap;
        }

        .menu--item {
          background: inherit;
          color: black;
          padding: 10px;
          border: none;
          font-weight: 700;
          transition: all 0.3s;
        }

        .menu--item:hover {
          background: #CA8A00;
          color: white;
        }

        .menu--child {
          padding-left: 30px;
          text-align: left;
          transition all 0.3s;
          background: #FFDA45;
        }

        .invisible {
          overflow: hidden;
          height: 0;
          padding: 0;
          animation: fadeOut 0.8s;
        }

        .visible {
          animation: fadeIn 0.8s;
        }

        .chosen {
          border: solid #0d1e52 2px;
          background-color: #f57c00;
        }

        .subChosen {
            background-color: #fff176;
        }

        .search--coincidence {
            background-color: #ff9925;
        }

        .search {
            height: 30px;
            margin: 2%;
            border: 0px;
            padding: 0px;
            padding-left: 15px;
            border-radius: 30px;
            text-align-last: left;
            font-size: 17px;
        }

        .hr {
            width: 80%;
            align: center;
            border: none;
            border-bottom: 1px solid #CA8A00;
        }
      `
    ];
  }

  //Activa subsecciones, si esta activo el buscador no se activa bien :( revisar...
  _activateMenu (event:MouseEvent) {
    // recibe como parametro el evento click, se ignora error de atributo no encontrado (hacer interfaz)
    this._busqueda = '';
    //@ts-ignore
    let id : string = event.target.id;
    store.dispatch(navigate("/" + id));
  }

  _activateAndRedirect (event : MouseEvent){
    this._redirect(event);
    this._activateMenu(event);
  }

  //Redirecciona a subseccion, cambiando nombre de pagina
  _redirect (event : MouseEvent){
    //@ts-ignore
    let id : string = event.target.id;

    //solucion momentanea? por no actualizacion de _page
    this.pageCall(this._page);

    //Cambiando estilo de subseccion seleccionada
    //(Ocurre un glitch cuando se selecciona el mismo submenu 2 veces, luego su menú y luego otro submenu, se marcan 2 submenus)
    let seccion: any;   //html
    //@ts-ignore
    for (seccion of this.shadowRoot.children){
        if (seccion.className.includes('menu--child')){
            //@ts-ignore
            if (seccion.innerText == event.target.innerText){
                seccion.className = seccion.className + ' subChosen'
            }else{
                seccion.className = seccion.className.replace(' subChosen','');
            }
        }
    }
    store.dispatch(navigate("/" + id));
  }

  //Barra de busqueda menu
  _buscar(event:MouseEvent){
      //@ts-ignore
      let enBusqueda : string = event.target.value;
      this._busqueda = enBusqueda.toLowerCase();
  }

  /* Render se ejecuta cada vez que se modifica una variable marcada como property, OJO: no se verifican las
   * subpropiedades de los objetos, pueden requerir una actualización usando this.requestUpdate();
   * Más info: https://polymer-library.polymer-project.org/3.0/docs/devguide/observers */
  protected render() {
    /* Acá está la página principal, cada componente debería tener un lugar donde puedan probarlo. */
    return html`
        <input class="search" @keyup = "${this._buscar}" type = "text" placeholder = "             B ú s q u e d a 🔍"/>
        <hr class="hr" >

        <button id = 'Noticias_Menu' class = "menu--item${(this._page == 'Noticias_Menu') ? ' chosen' : ''}" @click="${this._activateAndRedirect}">Noticias</button>
        <button id = 'Ramos_Menu' class = "menu--item${(this._page == 'Ramos_Menu') ? ' chosen' : ''}" @click="${this._activateMenu}">Ramos</button>
          <button id = 'Busqueda_de_ramos' class = "${"menu--item menu--child " + ((this._page == 'Ramos_Menu' || this._page == 'Busqueda_de_ramos' || this._page == 'Asignaturas_inscritas' || this._page == 'Inscripcion') ? 'visible' : 'invisible')}" @click="${this._redirect}">Búsqueda de ramos</button>
          <button id = 'Asignaturas_inscritas' class = "${"menu--item menu--child " + ((this._page == 'Ramos_Menu' || this._page == 'Busqueda_de_ramos' || this._page == 'Asignaturas_inscritas' || this._page == 'Inscripcion') ? 'visible' : 'invisible')}" @click="${this._redirect}">Asignaturas inscritas</button>
          <button id = 'Inscripcion' class = "${"menu--item menu--child " + ((this._page == 'Ramos_Menu' || this._page == 'Busqueda_de_ramos' || this._page == 'Asignaturas_inscritas' || this._page == 'Inscripcion') ? 'visible' : 'invisible')}" @click="${this._redirect}">Inscripción</button>
        <button id = 'Solicitudes_Menu' class = "menu--item${(this._page == 'Solicitudes_Menu') ? ' chosen' : ''}" @click="${this._activateMenu}">Solicitudes Externas</button>
          <button id = 'Certificados' class = "${"menu--item menu--child " + ((this._page == 'Certificados' || this._page == 'Cambio_de_mencion' || this._page == 'Solicitudes_academicas_y_peticiones' || this._page == 'Matricula_sin_ramos' || this._page == 'Autorizacion_academica' || this._page == 'Solicitudes_Menu') ? 'visible' : 'invisible')}" @click="${this._redirect}">Certificados</button>
          <button id = 'Cambio_de_mencion' class = "${"menu--item menu--child " + ((this._page == 'Certificados' || this._page == 'Cambio_de_mencion' || this._page == 'Solicitudes_academicas_y_peticiones' || this._page == 'Matricula_sin_ramos' || this._page == 'Autorizacion_academica' || this._page == 'Solicitudes_Menu') ? 'visible' : 'invisible')}" @click="${this._redirect}">Cambio de mención</button>
          <button id = 'Solicitudes_academicas_y_peticiones' class = "${"menu--item menu--child " + ((this._page == 'Certificados' || this._page == 'Cambio_de_mencion' || this._page == 'Solicitudes_academicas_y_peticiones' || this._page == 'Matricula_sin_ramos' || this._page == 'Autorizacion_academica' || this._page == 'Solicitudes_Menu') ? 'visible' : 'invisible')}" @click="${this._redirect}">Solicitudes Académicas y Peticiones</button>
          <button id = 'Matricula_sin_ramos' class = "${"menu--item menu--child " + ((this._page == 'Certificados' || this._page == 'Cambio_de_mencion' || this._page == 'Solicitudes_academicas_y_peticiones' || this._page == 'Matricula_sin_ramos' || this._page == 'Autorizacion_academica' || this._page == 'Solicitudes_Menu') ? 'visible' : 'invisible')}" @click="${this._redirect}">Matrícula Sin Ramos</button>
          <button id = 'Autorizacion_academica' class = "${"menu--item menu--child " + ((this._page == 'Certificados' || this._page == 'Cambio_de_mencion' || this._page == 'Solicitudes_academicas_y_peticiones' || this._page == 'Matricula_sin_ramos' || this._page == 'Autorizacion_academica' || this._page == 'Solicitudes_Menu') ? 'visible' : 'invisible')}" @click="${this._redirect}">Autorización Académica</button>
        <button id = 'Enlaces_Menu' class = "menu--item${(this._page == 'Enlaces_Menu') ? ' chosen' : ''}" @click="${this._activateMenu}">Enlaces Externos</button>
          <button id = 'Sireb' class = "${"menu--item menu--child " + ((this._page == 'Enlaces_Menu' || this._page == 'Sireb' || this._page == 'Aula') ? 'visible' : 'invisible')}" @click="${this._redirect}">Sireb</button>
          <button id = 'Aula' class = "${"menu--item menu--child " + ((this._page == 'Enlaces_Menu' || this._page == 'Sireb' || this._page == 'Aula') ? 'visible' : 'invisible')}" @click="${this._redirect}">Aula</button>

    `;
  }

  constructor() {
    super();
    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
    setPassiveTouchGestures(true);
  }

  /* Esta función se ejecuta solo una vez, util para cargar datos. */
  protected firstUpdated() {
    installRouter((location) => store.dispatch(navigate(decodeURIComponent(location.pathname))));
    installOfflineWatcher((offline) => store.dispatch(updateOffline(offline)));
    installMediaQueryWatcher(`(min-width: 460px)`,
        () => store.dispatch(updateDrawerState(false)));

    // Cargando datos
    store.dispatch(getAllCursos());
  }

  /* Esta función se ejecuta DESPUES de cada render. */
  protected updated(changedProps: PropertyValues) {
    //console.log("MENU",changedProps); //Debug updates
    if (changedProps.has('_page')) {
      const pageTitle = this.appTitle + ' - ' + this._page;
      updateMetadata({
        title: pageTitle,
        description: pageTitle
        // This object also takes an image property, that points to an img src.
      });
    }

    //Buscador coincidencias busqueda, se ignoran errores obtenidos de extracción del DOM
    if (changedProps.has('_busqueda')) {
        let i : number = 2;
        //@ts-ignore

        while (i < (this.shadowRoot.children.length)){
            //@ts-ignore
            let seccion = this.shadowRoot.children[i];
            //@ts-ignore
            let nombreSeccion = seccion.innerText.toLowerCase()

            if (this._busqueda != ''){
                //busqueda de coincidencias en subsecciones
                if (seccion.className.includes('menu--child')){
                    if (nombreSeccion.includes(this._busqueda)){
                        seccion.className = 'menu--item menu--child visible';
                    }else{
                        seccion.className = 'menu--item menu--child invisible';
                    }
                }else{
                    //Busqueda en secciones
                    if (nombreSeccion.includes(this._busqueda)){
                        seccion.className = 'menu--item search--coincidence';
                    }else{
                        seccion.className = 'menu--item';
                    }
                }
            }else{
                //reestablecimiento de visualizacion subsecciones por campo vacio
                if (seccion.className.includes('menu--item menu--child')){
                    seccion.className = 'menu--item menu--child invisible';
                }else{ //menu--item
                    seccion.className = 'menu--item';
                }
            }
            i++;
        }
    }
    /* Si queremos modificar la página o leer el contenido que hay en algún input debemos trabajar
     * directamente con el DOM element. PERO cada elemento tiene su propio shadowRoot, por lo que
     * para tomar algo de la página, por ejemplo la barra de navegación podemos:
        let navBar = this.shadowRoot.getElementById('nav-bar');
     * Así tenemos la navBar, si fuera un input podríamos leerlo con navBar.value */
  }

  /* Esta función se ejecuta cada vez que el state cambia, se usa para leer la memoria. */
  stateChanged(state: RootState) {
    this._page = state.app!.page;
  }
}
