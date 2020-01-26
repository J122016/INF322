/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, css, property, customElement } from 'lit-element';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store.js';
import { ButtonSharedStyles } from './button-shared-styles.js';
import { StringMigas } from '../reducers/migas';

@customElement('navegacion-pan')
export class navegacionPan extends connect(store)(LitElement) {
  @property({type: Object})
  public migas: StringMigas = {};

  static get styles() {
    return [
      ButtonSharedStyles,
      css`
        :host {
            display: block;
        }

        .miga {
            width: 10%
        }
        .left{
            text-align: left;
        }
      `
    ];
  }


  handleClick() {
    console.log(this.migas);
  }

  protected render() {
    return html`
      ${Object.keys(this.migas).map((key) => {
        const vista = this.migas[key];
        if(vista.nivel == 0){
            return html`
            ${vista.nombre}
        `;
        } else {
            return html`
            >
            <a href=""> ${vista.nombre} </a>
          `;}
        })}
        `;
    }
}
