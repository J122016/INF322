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
import { ListaCursos } from '../reducers/cursos';

//import {getAllDescriptions} from '../actions/description';    //Para busqueda?

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

@customElement('main-page')
export class MainPage extends connect(store)(LitElement) {
  @property({type: Object})
  private _cursos: ListaCursos = {};

  @property({type: Boolean})
  private _loggedIn: boolean = false;

  @property({type: String})
  private activeTab: string = "";

  @property({type: String})
  private _page: string = '';

  private appTitle : string = 'Siga';

  static get styles() {
    return [customCss,
      css`
        :host {
          display: block;
          height: 100vh;
        }

        @keyframes fadeIn {
          from {opacity: 0.0;}
          to   {opacity 1.0;}
        }
        @keyframes fadeOut {
          from {opacity: 1.0;}
          to   {opacity 0.0;}
        }

        #main {
          height: 100%;
          grid-template-columns: 300px calc(100% - 300px);
          grid-template-rows: 80px calc(100% - 160px) 80px;
        }

        #header {
          background-color: #0d1e52;
          text-align: left;
          color: white;
          padding: 2%;
          grid-row: 1;
          grid-column: 1 / 3;
          display: flex;
          justify-content: space-between;
        }

        #content {
          display: flex;
          flex-flow: row nowrap;
          align-items: stretch;
        }

        #logInButton {
          cursor: pointer;
          border: 1px solid gray;
          border-radius: 4px;
          padding: 5px;
          background: aliceblue;
        }

        #logInButton:hover {
          background: aqua;
        }

        #footer {
        grid-column: 1 / 3;
        background-color: #faba25;
        align-content: center;
        }

        .centered {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        }

        .component-margin {
            align-self: center;
            margin: auto;
            animation: fadeIn 0.5s;
        }

        .breadcrumb-margin {
            margin: 1% 1%
        }

        .menu {
            max-width: 300px;
            width: 33%;
            min-width: 120px;
            flex: 0 0 auto;
            background: #FABA25;
            color: white;
            display: flex;
            flex-flow: column nowrap;
        }
      `
    ];
  }

  _logIn () {
    this._loggedIn = (Math.random() > .0);
    if (!this._loggedIn) {
        alert('try again!');
    }
  }

  //Solucion alternativa, no se actualiza _page cuando cambia en componente interior
  private pageCallbackFunction = (mensaje: string) => {
    this._page = mensaje;
    this.activeTab = mensaje; // Con esto desmarca la casilla "Noticias" si esta marcada, pero los submenus se cierran al presionar alguna opcion.
    this.render();
  }

  _section(){
      //Opcion 1 switches, retornando el componente (mientras probando con html)
      switch (this._page){
          case 'Noticias': {return html`<div class = "component-margin"><p>Noticias importantes para el usuario</p><p>Documentos con información general</p></div>`; break;}
          case 'Búsqueda de ramos': {return html `<horario-clases class="component-margin" .cursos="${this._cursos}"></horario-clases>`; break;}
          case 'Seccion ejemplo': {return html`<div class = "component-margin">retornar componente sección ejemplo</div>` ; break;}
          default: {return html`<div class = "component-margin">${this._page}</div>` ; break;}
      }

      //Opcion 2 usando mismo nombre de pagina - requiere modificar nombres de componentes para que coincidan, ejemplo:
      //return html`<"${this._page}">NEWS</"${this._page}">`;
  }

  /* Render se ejecuta cada vez que se modifica una variable marcada como property, OJO: no se verifican las
   * subpropiedades de los objetos, pueden requerir una actualización usando this.requestUpdate();
   * Más info: https://polymer-library.polymer-project.org/3.0/docs/devguide/observers */
  protected render() {
    /* Acá está la página principal, cada componente debería tener un lugar donde puedan probarlo. */
    return html`
    ${this._loggedIn ? html`
    <nav-bar id="header" class="navbar" style="vertical-align: middle;" .pageCall="${this.pageCallbackFunction}"></nav-bar>

        <div id="content">
            <side-menu class="menu" ._active = "${this.activeTab}" .pageCall="${this.pageCallbackFunction}"> </side-menu>
            <!-- ACA está la utilización del componente, para pasarle datos usen un punto '.' más
                 el nombre de la variable del componente (public) -->
            ${this._section()}
        </div>

        <div id="footer">
        </div>

    </div>
    ` : html`
    <div class="centered">
        <span id="logInButton" @click="${this._logIn}">
            Click here to try to log in!
        </span>
    </div>`}
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
    //console.log("BOSS",this._page);   //Debug updates
    if (changedProps.has('_page')) {
      const pageTitle = this.appTitle + ' - ' + this._page;
      updateMetadata({
        title: pageTitle,
        description: pageTitle
        // This object also takes an image property, that points to an img src.
      });
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
    this._cursos = state.cursos!.cursos;
  }
}
