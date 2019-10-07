import { PageView, store } from '@things-factory/shell'
import { html } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import '../image-uploader'

import { i18next } from '@things-factory/i18n-base'

class ImageUploaderUiTest extends PageView {
  static get properties() {
    return {
      imageUploaderUi: String
    }
  }
  render() {
    return html`
      <section>
        <h2>ImageUploaderUi</h2>
        <image-uploader
          @image-upload-succeeded=${e => {
            var { files } = e.detail

            var length = Array.from(files).length

            var message = i18next.t('text.image upload succeeded', {
              count: length
            })

            document.dispatchEvent(
              new CustomEvent('notify', {
                detail: {
                  level: 'info',
                  message
                }
              })
            )

            console.log(message)
          }}
        ></image-uploader>
      </section>
    `
  }
}

window.customElements.define('image-uploader-ui-test', ImageUploaderUiTest)
