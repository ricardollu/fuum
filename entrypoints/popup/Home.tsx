import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import MikanTab from './MikanTab'
import CollectionTab from './CollectionTab'
import FuumTab from './FuumTab'

function Home() {
  return (
    <>
      <Tabs defaultValue="mikan">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mikan">Mikan</TabsTrigger>
          <TabsTrigger value="collection">Collection</TabsTrigger>
          <TabsTrigger value="config">Config</TabsTrigger>
        </TabsList>
        <TabsContent value="mikan">
          <MikanTab />
        </TabsContent>
        <TabsContent value="collection">
          <CollectionTab />
        </TabsContent>
        <TabsContent value="config">
          <FuumTab />
        </TabsContent>
      </Tabs>
    </>
  )
}

export default Home
