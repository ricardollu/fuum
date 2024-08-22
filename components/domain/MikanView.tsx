import { Mikan } from '@/lib/types'
import { Label } from '../ui/label'

export default ({ mikan }: { mikan: Mikan }) => {
  return (
    <>
      <Label>番剧名称</Label>
      <p>{mikan.name}</p>
    </>
  )
}
