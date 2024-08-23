import { ApiResponse, Mikan } from '@/lib/types'
import { api } from '@/lib/utils'
import { defineExtensionMessaging } from '@webext-core/messaging'

export interface ProtocolMap {
  saveMikan(mikan: Mikan): ApiResponse
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>()

export default defineBackground({
  main() {
    console.log('Hello background!', { id: browser.runtime.id })

    onMessage('saveMikan', (message) =>
      api<ApiResponse>('http://localhost:3000/add-mikan', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message.data),
      }),
    )
  },
})
