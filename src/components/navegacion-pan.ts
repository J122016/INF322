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
  private vistasOK: number[] = [];
  //Falta diferenciar niveles, ya sea por código o css
  private nivel: string = '';

  static get styles() {
    return [
      ButtonSharedStyles,
      css`
        :host {
            display: block;
        }

        .miga {
            width: -webkit-fill-available;
            text-align: inherit;
            background: inherit;
            background-color: #faba25;
            color: black;
            padding: 10px;
            border: none;
            font-weight: 700;
            transition: all .5s;
        }
        .hijo {
            text-align: center;
        }

        .miga:hover {
          background: #CA8A00;
          color: white;
          background-color: orange;
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

  buscarHijos(vista: any) {
      if(vista.hijos.length == 0){
          this.vistasOK.push(vista.id);
          //this.nivel = this.nivel.slice(0, -1);
          return html`<button class="miga"  href="/"> ${this.nivel} ${vista.nombre}  </button>`;
      } else {
          for (const i of vista.hijos){
              this.vistasOK.push(vista.id);
              //this.nivel = this.nivel.concat('|');
              return html`<button class="miga"  href="/"> ${this.nivel} ${vista.nombre} </button> ${this.buscarHijos(this.migas[i])}`;
          }
      }
  }

  protected render(){
      return html`
        ${Object.keys(this.migas).map((key) =>{
            const vista = this.migas[key];
            if (!this.vistasOK.includes(vista.id)){
                return this.buscarHijos(vista);
            } else {
                return;
            }
        })}
      `;
  }
}
