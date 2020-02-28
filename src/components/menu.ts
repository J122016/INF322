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
  private _active: string = '';

  @property({type: String})
  public _busqueda: string = '';

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
        .menu--answer {
          animation: fadeIn 0.8s;
          background: red;
        }
        .chosen {
          border: solid black 5px;
        }
      `
    ];
  }

  _activateMenu (event:MouseEvent) {
    // recibe como parametro el evento click, se ignora error de atributo no encontrado (hacer interfaz)
    //@ts-ignore
    let id : string = event.target.id;
    switch (id){
        case 'Noticias_Menu': {this._active = ((this._active == 'Noticias') ? '' : 'Noticias') ; break;}
        case 'Ramos_Menu': {this._active = ((this._active == 'Ramos') ? '' : 'Ramos') ; break;}
        case 'Solicitudes_Menu': {this._active = ((this._active == 'Solicitudes Externas') ? '' : 'Solicitudes Externas') ; break;}
        case 'Enlaces_Menu': {this._active = ((this._active == 'Enlaces Externos') ? '' : 'Enlaces Externos') ; break;}
        default: {this._active = '' ; break;}
    }
  }

  _activateAndRedirect (event : MouseEvent){
    this._activateMenu(event);
    this._redirect(event);
  }

  _redirect (event : MouseEvent){
    //Redirecciona a subseccion, ahora solo cambia nombre de pagina
    //@ts-ignore
    let id : string = event.target.innerText;
    this._page = id;
  }

  /* Render se ejecuta cada vez que se modifica una variable marcada como property, OJO: no se verifican las
   * subpropiedades de los objetos, pueden requerir una actualización usando this.requestUpdate();
   * Más info: https://polymer-library.polymer-project.org/3.0/docs/devguide/observers */
  protected render() {
    /* Acá está la página principal, cada componente debería tener un lugar donde puedan probarlo. */
    return html`

        <button id = 'Noticias_Menu' class = "menu--item${(this._active == 'Noticias') ? ' chosen' : ''}" @click="${this._activateAndRedirect}">Noticias</button>
        <button id = 'Ramos_Menu' class = "menu--item${(this._active == 'Ramos') ? ' chosen' : ''}" @click="${this._activateMenu}">Ramos</button>
          <button class = "${"menu--item menu--child " + ((this._active == 'Ramos') ? 'visible' : 'invisible')}" @click="${this._redirect}">Búsqueda de ramos</button>
          <button class = "${"menu--item menu--child " + ((this._active == 'Ramos') ? 'visible' : 'invisible')}" @click="${this._redirect}">Asignaturas inscritas</button>
          <button class = "${"menu--item menu--child " + ((this._active == 'Ramos') ? 'visible' : 'invisible')}" @click="${this._redirect}">Inscripción</button>
        <button id = 'Solicitudes_Menu' class = "menu--item${(this._active == 'Solicitudes Externas') ? ' chosen' : ''}" @click="${this._activateMenu}">Solicitudes Externas</button>
          <button class = "${"menu--item menu--child " + ((this._active == 'Solicitudes Externas') ? 'visible' : 'invisible')}" @click="${this._redirect}">Certificados</button>
          <button class = "${"menu--item menu--child " + ((this._active == 'Solicitudes Externas') ? 'visible' : 'invisible')}" @click="${this._redirect}">Cambio de mención</button>
          <button class = "${"menu--item menu--child " + ((this._active == 'Solicitudes Externas') ? 'visible' : 'invisible')}" @click="${this._redirect}">Solicitudes Académicas y Peticiones</button>
          <button class = "${"menu--item menu--child " + ((this._active == 'Solicitudes Externas') ? 'visible' : 'invisible')}" @click="${this._redirect}">Matrícula Sin Ramos</button>
          <button class = "${"menu--item menu--child " + ((this._active == 'Solicitudes Externas') ? 'visible' : 'invisible')}" @click="${this._redirect}">Autorización Académica</button>
        <button id = 'Enlaces_Menu' class = "menu--item${(this._active == 'Enlaces Externos') ? ' chosen' : ''}" @click="${this._activateMenu}">Enlaces Externos</button>
          <button class = "${"menu--item menu--child " + ((this._active == 'Enlaces Externos') ? 'visible' : 'invisible')}" @click="${this._redirect}">Sireb</button>
          <button class = "${"menu--item menu--child " + ((this._active == 'Enlaces Externos') ? 'visible' : 'invisible')}" @click="${this._redirect}">Aula</button>

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
        let i = 0;
        while (i < 14){ //secciones.lenght){
            //@ts-ignore
            let seccion = this.shadowRoot.children[i].innerText.toLowerCase();

            if (this._busqueda != ''){
                if (seccion.includes(this._busqueda)){
                    //@ts-ignore
                    if (this.shadowRoot.children[i].className == 'menu--item menu--child invisible'){
                        //@ts-ignore
                        this.shadowRoot.children[i].className = 'menu--item menu--child visible';
                    }
                    //@ts-ignore
                    this.shadowRoot.children[i].style.display = "block"

                }else{
                    //@ts-ignore
                    this.shadowRoot.children[i].style.display = "none"
                }

            }else{
                //@ts-ignore
                if (this.shadowRoot.children[i].className.includes('menu--item menu--child')){
                    //@ts-ignore
                    this.shadowRoot.children[i].className = 'menu--item menu--child invisible';
                }
                //@ts-ignore
                this.shadowRoot.children[i].style.display = "block"
            }
            i++;
        }

        //if ('noticias'.includes(this._busqueda)){
        //    this.shadowRoot.getElementById('Noticias_Menu').className = "menu--answer";
        //}else{
        //    this.shadowRoot.getElementById('Noticias_Menu').className = "menu--item";
        //}
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
