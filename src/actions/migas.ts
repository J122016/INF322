/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/* En este archivo se escriben las aciones que serán llamadas por la vista, en general se debería obtener
 * datos de una API, pero acá, como ejemplo están escritos directamente. */

import { Action, ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store.js';
import { StringMigas } from '../reducers/migas';
export const GET_MIGAS = 'GET_MIGAS';

export interface ActionGetMigas extends Action<'GET_MIGAS'> {migas: StringMigas};
export type MigasAction = ActionGetMigas;

type ThunkResult = ThunkAction<void, RootState, undefined, MigasAction>;

const MIGAS_LIST = [
  {"nivel":0, "nombre": 'SIGA'},
  {"nivel":1, "nombre": 'MAIN'},
  {"nivel":2, "nombre": 'CURSOS'}
];

export const getAllMigas: ActionCreator<ThunkResult> = () => (dispatch) => {
  const migas = MIGAS_LIST.reduce((obj, miga) => {
    //obj[miga.anterior] = {'anterior': miga.anterior.concat('>').concat(miga.nueva), 'nueva': miga.nueva, 'retroceso': true};
    obj[miga.nivel] = miga;
    return obj
}, {} as StringMigas);

  dispatch({
    type: GET_MIGAS,
    migas
  });
};