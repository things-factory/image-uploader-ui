import '@material/mwc-icon'
import '@material/mwc-icon-button'
import { client } from '@things-factory/shell'
import { css, html, LitElement } from 'lit-element'

export class ImageUploadPreviewer extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .upload-thumb-wrap {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .upload-thumb-wrap img {
          display: block;
          max-width: 100%;
          max-height: 100%;
          flex: 0;
        }
      `
    ]
  }

  static get properties() {
    return {
      file: Object
    }
  }

  render() {
    return html`
      <div class="upload-thumb-wrap">
        <img class="upload-thumb" src="${window.URL.createObjectURL(this.file)}" />
      </div>
    `
  }
}

window.customElements.define('image-upload-previewer', ImageUploadPreviewer)
