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

  private appTitle : string = 'Siga';
  
  static get styles() {
    return [customCss,
      css`

        @keyframes fadeIn {
          from {opacity: 0.0;}
          to   {opacity 1.0;}
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
          transition all 0.3s;
          background: #FFDA45;
        }

        .invisible {
          display: none;
          opacity: 0;
        }

        .visible {
          animation: fadeIn 0.5s;
        }
      `
    ];
  }

  _activate () {
    this._active = '';
  }

  _activateRamos () {
    this._active = 'Ramos';
    console.log('Ramos');
  }

  _activateSolicitudesExternas () {
    this._active = 'Solicitudes Externas';
    console.log('Solicitudes  ');
  }

  _activateEnlacesExternos () {
    this._active = 'Enlaces Externos';
  }

  /* Render se ejecuta cada vez que se modifica una variable marcada como property, OJO: no se verifican las
   * subpropiedades de los objetos, pueden requerir una actualización usando this.requestUpdate();
   * Más info: https://polymer-library.polymer-project.org/3.0/docs/devguide/observers */
  protected render() {
    /* Acá está la página principal, cada componente debería tener un lugar donde puedan probarlo. */
    return html`
      
        <button class = "menu--item" @click="${this._activate}">Noticias</button>
        <button class = "menu--item" @click="${this._activateRamos}">Ramos</button>
          <button class = ${"menu--item menu--child " + ((this._active == 'Ramos') ? 'visible' : 'invisible')}>Búsqueda de ramos</button>
          <button class = ${"menu--item menu--child " + ((this._active == 'Ramos') ? 'visible' : 'invisible')}>Asignaturas inscritas</button>
          <button class = ${"menu--item menu--child " + ((this._active == 'Ramos') ? 'visible' : 'invisible')}>Inscripción</button>
        <button class = "menu--item" @click="${this._activateSolicitudesExternas}">Solicitudes Externas</button>
          <button class = ${"menu--item menu--child " + ((this._active == 'Solicitudes Externas') ? 'visible' : 'invisible')}>Certificados</button>
          <button class = ${"menu--item menu--child " + ((this._active == 'Solicitudes Externas') ? 'visible' : 'invisible')}>Cambio de mención</button>
          <button class = ${"menu--item menu--child " + ((this._active == 'Solicitudes Externas') ? 'visible' : 'invisible')}>Solicitudes Académicas y Peticiones</button>
          <button class = ${"menu--item menu--child " + ((this._active == 'Solicitudes Externas') ? 'visible' : 'invisible')}>Matrícula Sin Ramos</button>
          <button class = ${"menu--item menu--child " + ((this._active == 'Solicitudes Externas') ? 'visible' : 'invisible')}>Autorización Académica</button>
        <button class = "menu--item" @click="${this._activateEnlacesExternos}">Enlaces Externos</button>
          <button class = ${"menu--item menu--child " + ((this._active == 'Enlaces Externos') ? 'visible' : 'invisible')}>Sireb</button>
          <button class = ${"menu--item menu--child " + ((this._active == 'Enlaces Externos') ? 'visible' : 'invisible')}>Aula</button>
      
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
