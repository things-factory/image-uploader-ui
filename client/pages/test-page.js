import { PageView, store } from '@things-factory/shell'
import { html } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import '../image-uploader'

class ImageUploaderUiTest extends connect(store)(PageView) {
  static get properties() {
    return {
      imageUploaderUi: String
    }
  }
  render() {
    return html`
      <section>
        <h2>ImageUploaderUi</h2>
        <image-uploader></image-uploader>
      </section>
    `
  }

  stateChanged(state) {
    this.imageUploaderUi = state.imageUploaderUi.state_main
  }
}

window.customElements.define('image-uploader-ui-test', ImageUploaderUiTest)
