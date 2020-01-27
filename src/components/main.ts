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

import { getAllMigas } from '../actions/migas';
import { StringMigas } from '../reducers/migas';
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
import './navegacion-pan';

@customElement('main-page')
export class MainPage extends connect(store)(LitElement) {
  @property({type: Object})
  private _cursos: ListaCursos = {};

  @property({type: Boolean})
  private _loggedIn: boolean = false;

  @property({type: String})
  private _page: string = '';

  @property({type: String})
  private _migas: StringMigas = {};

  @property({type: String})
  private _busqueda: string = 'INSERTAR BUSCADOR AQUI!!!';

  private appTitle : string = 'Siga';

  static get styles() {
    return [customCss,
      css`
        :host {
          display: block;
          height: 100vh;
        }

        #main {
          display: grid;
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
        }

        #nav-bar {
          grid-row: 2;
          grid-column: 1;
          background-color: orange;
        }

        #content {
          grid-row: 2;
          grid-column: 2;
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
          margin: 10% 10%
        }

        .breadcrumb-margin {
            /*column-count: 1;
            margin: 1% 1%*/
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

  /* Render se ejecuta cada vez que se modifica una variable marcada como property, OJO: no se verifican las
   * subpropiedades de los objetos, pueden requerir una actualización usando this.requestUpdate();
   * Más info: https://polymer-library.polymer-project.org/3.0/docs/devguide/observers */
  protected render() {
    /* Acá está la página principal, cada componente debería tener un lugar donde puedan probarlo. */
    return html`
    ${this._loggedIn ? html`
    <div id="main">
        <div id="header" style="vertical-align: middle;column-count: 3">
            <div>USM🏠</div>

            <!--CREAR UN COMPONENTE PARA LA BARRA DE BUSQUEDA -->
            <busqueda class="component-margin" .busqueda="${this._busqueda}">
                🔎<input type = "text" value = "Buscar Q"/>
            </busqueda>

            <div>Sesión de ALUMNO NOMBRE APELLIDO</div>
        </div>

        <div id="nav-bar">
            <!-- AGREGAR CALCULO DE SUBNIVELES Y link's funcionales-->
           <navegacion-pan class=" breadcrumb-margin" .migas="${this._migas}"></navegacion-pan>
        </div>

        <div id="content">
            <!-- ACA está la utilización del componente, para pasarle datos usen un punto '.' más
                 el nombre de la variable del componente (public) -->
            <horario-clases class="component-margin" .cursos="${this._cursos}"></horario-clases>
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
    store.dispatch(getAllMigas());
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
    this._migas = state.migas!.migas;
    //this._busqueda = state.app!.busqueda; //no estoy seguro
  }
}
