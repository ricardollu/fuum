import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { Switch } from '@/components/ui/switch'
import { ApiResponse, Collection, collectionSchema } from '@/lib/types'
import { Trash2 } from 'lucide-react'
import { api } from '@/lib/utils'
import { useConfig } from '@/composeables/useConfig'

const CollectionForm = ({ collection, afterSave = () => {} }: { collection: Collection; afterSave?: () => void }) => {
  const { config, is_config_loading } = useConfig()
  const form = useForm<z.infer<typeof collectionSchema>>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      ...collection,
    },
  })
  const season_folders = useFieldArray({
    control: form.control,
    name: 'season_folders',
  })
  const special_mappings = useFieldArray({
    control: form.control,
    name: 'special_mappings',
  })
  const [readOnly] = useState(false)

  function onSubmit(values: z.infer<typeof collectionSchema>) {
    if (is_config_loading) return
    api<ApiResponse>(config.muuf_api_endpoint + '/add-collection', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
      .then((res) => {
        toast({
          description: res.message,
        })
        if (afterSave) afterSave()
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 mx-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>番剧名称</FormLabel>
              <FormControl>
                <Input readOnly={readOnly} {...field} />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="torrent_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>下载地址</FormLabel>
              <FormControl>
                <Input readOnly={readOnly} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>番剧标题</FormLabel>
              <FormControl>
                <Input readOnly={readOnly} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <>
          <div>
            <Button
              type="button"
              onClick={() =>
                season_folders.append({
                  season: season_folders.fields.length + 1,
                  folder: '',
                })
              }
            >
              添加season文件夹匹配
            </Button>
          </div>
          {season_folders.fields.map((field, index) => (
            <div className="grid grid-cols-3 gap-4 items-end" key={field.id}>
              <FormField
                control={form.control}
                key={'title1' + field.id}
                name={`season_folders.${index}.season`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex items-center">
                        <div className="flex-1">{`匹配#${index + 1}`} </div>
                        <Button type="button" variant="ghost">
                          <Trash2
                            onClick={() =>
                              toast({
                                description: '确定要删除吗？',
                                action: (
                                  <ToastAction altText="删除" onClick={() => season_folders.remove(index)}>
                                    删除
                                  </ToastAction>
                                ),
                              })
                            }
                          />
                        </Button>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input readOnly={readOnly} type="number" placeholder="season" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                key={'url1' + field.id}
                name={`season_folders.${index}.folder`}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormControl>
                      <Input readOnly={readOnly} placeholder="folder" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </>
        <>
          <div>
            <Button
              type="button"
              onClick={() =>
                special_mappings.append({
                  name: '',
                  file_name: '',
                  match_and_replace: false,
                })
              }
            >
              添加特殊匹配替换
            </Button>
          </div>
          {special_mappings.fields.map((field, index) => (
            <div className="grid grid-cols-4 gap-4 items-end" key={field.id}>
              <FormField
                control={form.control}
                key={'title2' + field.id}
                name={`special_mappings.${index}.file_name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex items-center">
                        <div className="flex-1">{`替换#${index + 1}`} </div>
                        <Button type="button" variant="ghost">
                          <Trash2
                            onClick={() =>
                              toast({
                                description: '确定要删除吗？',
                                action: (
                                  <ToastAction altText="删除" onClick={() => special_mappings.remove(index)}>
                                    删除
                                  </ToastAction>
                                ),
                              })
                            }
                          />
                        </Button>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input readOnly={readOnly} placeholder="filename" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                key={'url2' + field.id}
                name={`special_mappings.${index}.name`}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormControl>
                      <Input readOnly={readOnly} placeholder="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                key={'switch2' + field.id}
                name={`special_mappings.${index}.match_and_replace`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>是否正则</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </>

        <FormField
          control={form.control}
          name="external_subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>外置字幕</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!readOnly && <Button type="submit">保存</Button>}
      </form>
    </Form>
  )
}

export default CollectionForm
