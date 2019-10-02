export default function route(page) {
  switch (page) {
    case 'image-uploader-ui-test':
      import('./pages/test-page')
      return page
  }
}
