import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import MikanTab from './MikanTab'
import CollectionTab from './CollectionTab'

function Home() {
  return (
    <>
      <Tabs defaultValue="mikan">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mikan">Mikan</TabsTrigger>
          <TabsTrigger value="collection">Collection</TabsTrigger>
        </TabsList>
        <TabsContent value="mikan">
          <MikanTab />
        </TabsContent>
        <TabsContent value="collection">
          <CollectionTab />
        </TabsContent>
      </Tabs>
    </>
  )
}

export default Home
