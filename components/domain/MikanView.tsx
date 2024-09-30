import { Mikan } from '@/lib/types'
import { Switch } from '@/components/ui/switch'
import { BadgePlus } from 'lucide-react'
import { Button } from '../ui/button'
import { sendMessage } from '@/entrypoints/background'
import { Input } from '../ui/input'

export default ({ mikan, setMikan }: { mikan: Mikan; setMikan: (mikan: Mikan) => void }) => {
  function add_mikan() {
    sendMessage('saveMikan', mikan)
      .then((res) => {
        alert(res.message)
      })
      .catch(async (e) => {
        const errorMessage = (await e.json()).message
        alert(errorMessage)
      })
  }
  return (
    <>
      <div className="flex flex-col space-y-2 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">{mikan.name}</h3>
        <a href={mikan.url} className="text-blue-500 hover:underline text-sm break-all" target="_blank">
          {mikan.url}
        </a>
        {mikan.extra.length > 0 && <h3 className="text-xl font-semibold leading-none tracking-tight">Extra Items</h3>}
        <div className="p-2">
          {mikan.extra.map((item, index) => (
            <div key={index} className="mb-2 text-sm">
              <span>{`${index + 1}. `}</span>
              <a href={item.url} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                {item.title}
              </a>
            </div>
          ))}
        </div>
        {mikan.skip.length > 0 && <h3 className="text-xl font-semibold leading-none tracking-tight">Skip Items</h3>}
        <div className="p-2">
          {mikan.skip.map((item, index) => (
            <div key={index} className="mb-2 text-sm">
              <span>{`${index + 1}. `}</span>
              <a href={item.url} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                {item.title}
              </a>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold leading-none tracking-tight">Title Filters({mikan.title_contain.length})</h3>
          <Button variant={'ghost'}>
            <BadgePlus
              onClick={() => {
                const filter = prompt('请输入关键字', '')
                if (filter) {
                  setMikan({
                    ...mikan,
                    title_contain: [...mikan.title_contain, filter],
                  })
                }
              }}
            />
          </Button>
        </div>
        {mikan.title_contain.map((item, index) => (
          <div key={index} className="mb-2 text-sm">
            <span>{`${index + 1}. `}</span>
            <span className="text-black-500">{item}</span>
          </div>
        ))}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">External Subtitle</h3>
          <Switch checked={mikan.external_subtitle} />
        </div>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">集数修正</h3>
          <Input
            type="number"
            value={mikan.ep_revise}
            className="w-1/2"
            onChange={(e) => {
              setMikan({
                ...mikan,
                ep_revise: parseInt(e.target.value),
              })
            }}
          />
        </div>
        <div>
          <Button onClick={add_mikan}>保存</Button>
        </div>
      </div>
    </>
  )
}
