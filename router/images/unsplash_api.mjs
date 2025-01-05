import { createApi } from 'unsplash-js'

const unsplash = createApi({
  accessKey: 'C6kQoGEWDV_KlMxZ3J14m_UdqM4lY85NkW984smPj6c',
  fetch: global.fetch,
})

export default unsplash