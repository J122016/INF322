/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/* Este es el reductor, acá se definen los tipos de datos, se le da forma al store y
 * se define como las acciones lo modifican */

import { Reducer } from 'redux';
import {
  GET_MIGAS
} from '../actions/migas.js';
import { RootAction } from '../store.js';

export interface MigasState {
  migas: StringMigas;
}

export interface StringMigas {
  [index:string]: Miga;
}

export interface Miga {
  id: number;
  nombre: string;
  hijos: string[];
}

const INITIAL_STATE: MigasState = {
  migas: {},
};

const migas: Reducer<MigasState, RootAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_MIGAS:
      return {
        ...state,
        migas: action.migas
      };
    default:
      return state;
  }
};

export default migas;
