/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

declare global {
  interface Window {
    process?: Object;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

import {
  createStore,
  compose,
  applyMiddleware,
  combineReducers,
  Reducer,
  StoreEnhancer
} from 'redux';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import { lazyReducerEnhancer } from 'pwa-helpers/lazy-reducer-enhancer.js';

import app, { AppState } from './reducers/app.js';
import { AppAction } from './actions/app.js';

/* Estos archivos manejan el store (la memoria de la página), usa redux así que cada elemento
 * es definido por un archivo en actions (que contiene las funciones que usa la vista) y uno
 * en reducers (donde está el código de como se modifica la memoria).
 * Todo lo definido debe ser impotado aquí: */
import cursos, { CursosState } from './reducers/cursos';
import { CursosAction } from './actions/cursos';

import migas, { MigasState } from './reducers/migas';
import { MigasAction } from './actions/migas';

// Este es el state principal, se define la estructura de datos...
export interface RootState {
  app?: AppState;
  cursos?: CursosState;
  migas?: MigasState;
}

// Se agrega el tipo de las acciones que creemos al tipo root.
export type RootAction = AppAction | CursosAction | MigasAction;

// Sets up a Chrome extension for time travel debugging.
// See https://github.com/zalmoxisus/redux-devtools-extension for more information.
const devCompose: <Ext0, Ext1, StateExt0, StateExt1>(
  f1: StoreEnhancer<Ext0, StateExt0>, f2: StoreEnhancer<Ext1, StateExt1>
) => StoreEnhancer<Ext0 & Ext1, StateExt0 & StateExt1> =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Initializes the Redux store with a lazyReducerEnhancer (so that you can
// lazily add reducers after the store has been created) and redux-thunk (so
// that you can dispatch async actions). See the "Redux and state management"
// section of the wiki for more details:
// https://github.com/Polymer/pwa-starter-kit/wiki/4.-Redux-and-state-management
export const store = createStore(
  state => state as Reducer<RootState, RootAction>,
  devCompose(
    lazyReducerEnhancer(combineReducers),
    applyMiddleware(thunk as ThunkMiddleware<RootState, RootAction>))
);

// Cargar reducers, aquí es donde se conectan los básicos, se pueden cargar a demanda tambien.
store.addReducers({ app });
store.addReducers({ cursos });
store.addReducers({ migas });
