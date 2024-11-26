import { ApiResponse, Mikan, Config, config_storage_key, default_config } from '@/lib/types'
import { api } from '@/lib/utils'
import { defineExtensionMessaging } from '@webext-core/messaging'
import { storage } from 'wxt/storage'

export interface ProtocolMap {
  saveMikan(mikan: Mikan): ApiResponse
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>()

export default defineBackground({
  main() {
    console.log('Hello background!', { id: browser.runtime.id })

    let config = default_config()
    storage.getItem<Config>(config_storage_key).then((c) => {
      if (c) {
        config = c
      }
    })
    storage.watch<Config>(config_storage_key, (new_config) => {
      if (new_config) {
        config = new_config
      }
    })

    onMessage('saveMikan', (message) => {
      return api<ApiResponse>(config.muuf_api_endpoint + '/add-mikan', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...message.data,
          season: message.data.season && message.data.season < 0 ? null : message.data.season,
        }),
      })
    })
  },
})
