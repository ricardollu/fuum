import { ApiResponse, Collection, default_collection, Mikan } from '@/lib/types'
import { api } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import styled from 'styled-components'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import CollectionForm from './CollectionForm'
import { useConfig } from '@/composeables/useConfig'

export default function CollectionTab() {
  const config = useConfig()
  const {
    data: collections,
    error,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['collections'],
    queryFn: () => api<Collection[]>(config.muuf_api_endpoint + '/collection'),
  })
  const [collection, setCollection] = useState<Collection | null>(null)

  if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }
  return (
    <>
      {!collection && (
        <>
          {collections.map((collection) => (
            <CollectionCard key={collection.torrent_url} collection={collection} onClick={(collection) => setCollection(collection)} afterRemove={() => refetch()} />
          ))}
          <div className="mx-4">
            <Button onClick={() => setCollection(default_collection())}>添加</Button>
          </div>
        </>
      )}
      {collection && (
        <>
          <div>
            <Button variant="ghost" className="flex items-center mx-2 my-2" onClick={() => setCollection(null)}>
              <ChevronLeft /> 返回
            </Button>
          </div>
          <CollectionForm collection={collection} afterSave={() => refetch()} />
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
const Title = styled.div`
  flex: 1;
  font-size: 0.75rem;
  word-break: break-word;
`

const CollectionCard = ({
  collection,
  onClick = () => {},
  afterRemove = () => {},
}: {
  collection: Collection
  onClick?: (collection: Collection) => void
  afterRemove?: (collection: Collection) => void
}) => {
  const config = useConfig()

  function removeCollection(collection: Collection) {
    api<ApiResponse>(config + '/rm-collection', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: collection.torrent_url,
      }),
    })
      .then((res) => {
        toast({
          description: res.message,
        })
        if (afterRemove) afterRemove(collection)
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
      <Title>{collection.name}</Title>
      <Button
        variant={'ghost'}
        onClick={() =>
          toast({
            description: '确定要删除吗？',
            action: (
              <ToastAction altText="删除" onClick={() => removeCollection(collection)}>
                删除
              </ToastAction>
            ),
          })
        }
      >
        <Trash2 />
      </Button>
      <Button variant={'ghost'}>
        <ChevronRight onClick={() => onClick(collection)} />
      </Button>
    </Card>
  )
}
