import '@material/mwc-icon'
import '@material/mwc-icon-button'
import { client } from '@things-factory/shell'
import gql from 'graphql-tag'
import { css, html, LitElement } from 'lit-element'

const CREATE_ATTACHMENTS_GQL = gql`
  mutation($attachments: [NewAttachment]!) {
    createAttachments(attachments: $attachments) {
      id
      name
      description
      mimetype
      encoding
      category
      path
      createdAt
      updatedAt
    }
  }
`

export class ImageUploader extends LitElement {
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

        #input-box {
          display: flex;
        }

        .filebox input[type='file'] {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }
        .filebox label {
          padding: 0.5em 0.75em;
          color: #999;
          font-size: inherit;
          line-height: normal;
          vertical-align: middle;
          background-color: #fdfdfd;
          cursor: pointer;
          border: 1px solid #ebebeb;
          border-bottom-color: #e2e2e2;
          border-radius: 0.25em;
        }
        /* named upload */
        .filebox .upload-name {
          flex: 1;
          padding: 0.5em 0.75em; /* label의 패딩값과 일치 */
          font-size: inherit;
          font-family: inherit;
          line-height: normal;
          vertical-align: middle;
          background-color: #f5f5f5;
          border: 1px solid #ebebeb;
          border-bottom-color: #e2e2e2;
          border-radius: 0.25em;
          -webkit-appearance: none; /* 네이티브 외형 감추기 */
          -moz-appearance: none;
          appearance: none;
        }

        /* imaged preview */
        .filebox .upload-display {
          /* 이미지가 표시될 지역 */
          margin-bottom: 5px;
        }

        .filebox .upload-thumb-wrap {
          /* 추가될 이미지를 감싸는 요소 */
          display: inline-block;
          width: 54px;
          padding: 2px;
          vertical-align: middle;
          border: 1px solid #ddd;
          border-radius: 5px;
          background-color: #fff;
        }
        .filebox .upload-display img {
          /* 추가될 이미지 */
          display: block;
          max-width: 100%;
          width: 100% \9;
          height: auto;
        }
      `
    ]
  }

  static get properties() {
    return {
      label: String,
      showFilename: {
        type: Boolean,
        attribute: 'show-filename'
      },
      _files: Array
    }
  }

  constructor() {
    super()

    this._files = []
  }

  render() {
    return html`
      <div class="filebox preview-image">
        <div class="upload-display">
          ${this._files.map(
            file => html`
              <div class="upload-thumb-wrap">
                <mwc-icon-button
                  icon="remove_circle_outline"
                  @click=${e => {
                    this._files = this._files.filter(f => f != file)
                  }}
                ></mwc-icon-button>
                <img class="upload-thumb" src="${window.URL.createObjectURL(file)}" />
              </div>
            `
          )}
        </div>
        <div id="input-box">
          ${this.showFilename
            ? html`
                <input
                  class="upload-name"
                  value="${this._files.map(f => f.name).join(', ') || this.label || 'select image'}"
                  disabled
                />
              `
            : html``}
          <label for="input-file"><mwc-icon>add_photo_alternate</mwc-icon></label>
          <input
            id="input-file"
            type="file"
            accept="image/*;"
            class="upload-hidden"
            multiple
            @change=${e => {
              this.onImageFileChanged(e)
            }}
          />
        </div>
      </div>
      <mwc-icon-button
        icon="cloud_upload"
        ?disabled=${this._files.length == 0}
        @click=${e => {
          if (e.currentTarget.hasAttribute('disabled')) return
          this._onUploadButtonClick(e)
        }}
      ></mwc-icon-button>
    `
  }

  get fileInput() {
    return this.renderRoot.querySelector('#input-file')
  }

  onImageFileChanged(e) {
    this._files = [...this._files, ...Array.from(e.currentTarget.files)]
  }

  async _onUploadButtonClick(e) {
    var response = await this.createAttachments('', this._files)
    var { createAttachments } = response.data

    if (createAttachments.length == 0) return

    this._files = []
    this.fileInput.value = ''

    this.dispatchEvent(
      new CustomEvent('image-upload-succeeded', {
        bubbles: true,
        composed: true,
        detail: {
          files: createAttachments
        }
      })
    )
  }

  async createAttachments(category, files) {
    /*
      ref. https://github.com/jaydenseric/graphql-multipart-request-spec#client
        - TODO support multiple file upload
    */

    return await client.mutate({
      mutation: CREATE_ATTACHMENTS_GQL,
      variables: {
        attachments: files.map(file => {
          return { category, file }
        })
      },
      context: {
        hasUpload: true
      }
    })
  }
}

window.customElements.define('image-uploader', ImageUploader)
