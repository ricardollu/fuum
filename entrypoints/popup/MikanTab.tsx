import { ApiResponse, default_mikan, Mikan } from '@/lib/types'
import { api } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import styled from 'styled-components'
import MikanForm from './MikanForm'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { useConfig } from '@/composeables/useConfig'

export default function MikanTab() {
  const config = useConfig()
  const {
    data: mikans,
    error,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['mikans'],
    queryFn: () => api<Mikan[]>(config.muuf_api_endpoint + '/mikan'),
  })
  const [mikan, setMikan] = useState<Mikan | null>(null)

  if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }
  return (
    <>
      {!mikan && (
        <>
          {mikans.map((mikan) => (
            <MikanCard key={mikan.url} mikan={mikan} onClick={(mikan) => setMikan(mikan)} afterRemove={() => refetch()} />
          ))}
          <div className="mx-4">
            <Button onClick={() => setMikan(default_mikan())}>添加</Button>
          </div>
        </>
      )}
      {mikan && (
        <>
          <div>
            <Button variant="ghost" className="flex items-center mx-2 my-2" onClick={() => setMikan(null)}>
              <ChevronLeft /> 返回
            </Button>
          </div>
          <MikanForm mikan={mikan} afterSave={() => refetch()} />
        </>
      )}
    </>
  )
}

const Card = styled.div`
  margin: 1rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
`
const Title = styled.span`
  flex: 1;
  font-size: 0.75rem;
`

const MikanCard = ({ mikan, onClick = () => {}, afterRemove = () => {} }: { mikan: Mikan; onClick?: (mikan: Mikan) => void; afterRemove?: (mikan: Mikan) => void }) => {
  const config = useConfig()
  function removeMikan(mikan: Mikan) {
    api<ApiResponse>(config.muuf_api_endpoint + '/rm-mikan', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: mikan.url,
      }),
    })
      .then((res) => {
        toast({
          description: res.message,
        })
        if (afterRemove) afterRemove(mikan)
      })
      .catch(async (e) => {
        const errorMessage = (await e.json()).message
        toast({
          variant: 'destructive',
          description: errorMessage,
        })
      })
  }

  return (
    <Card>
      <Title>{mikan.name}</Title>
      <Button
        variant={'ghost'}
        onClick={() =>
          toast({
            description: '确定要删除吗？',
            action: (
              <ToastAction altText="删除" onClick={() => removeMikan(mikan)}>
                删除
              </ToastAction>
            ),
          })
        }
      >
        <Trash2 />
      </Button>
      <Button variant={'ghost'}>
        <ChevronRight onClick={() => onClick(mikan)} />
      </Button>
    </Card>
  )
}
