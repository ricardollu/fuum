import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { Switch } from '@/components/ui/switch'
import { ApiResponse, Mikan, mikanSchema } from '@/lib/types'
import { Trash2 } from 'lucide-react'
import { api } from '@/lib/utils'

const MikanForm = ({
  mikan,
  afterSave = () => {},
}: {
  mikan: Mikan
  afterSave?: () => void
}) => {
  const form = useForm<z.infer<typeof mikanSchema>>({
    resolver: zodResolver(mikanSchema),
    defaultValues: {
      ...mikan,
      title_contain: mikan.title_contain.map((str) => ({ str })),
    },
  })
  const extra = useFieldArray({
    control: form.control,
    name: 'extra',
  })
  const skip = useFieldArray({
    control: form.control,
    name: 'skip',
  })
  const titleContain = useFieldArray({
    control: form.control,
    name: 'title_contain',
  })
  const [readOnly] = useState(false)

  function onSubmit(values: z.infer<typeof mikanSchema>) {
    const newMikan = {
      ...values,
      title_contain: values.title_contain.map(({ str }) => str),
    }
    api<ApiResponse>('http://localhost:3000/add-mikan', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMikan),
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
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>番剧地址</FormLabel>
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
              onClick={() => extra.append({ title: '', url: '' })}
            >
              添加额外项目
            </Button>
          </div>
          {extra.fields.map((field, index) => (
            <div className="grid grid-cols-3 gap-4 items-end" key={field.id}>
              <FormField
                control={form.control}
                key={'title1' + field.id}
                name={`extra.${index}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex items-center">
                        <div className="flex-1">{`额外#${index + 1}`} </div>
                        <Button type="button" variant="ghost">
                          <Trash2
                            onClick={() =>
                              toast({
                                description: '确定要删除吗？',
                                action: (
                                  <ToastAction
                                    altText="删除"
                                    onClick={() => extra.remove(index)}
                                  >
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
                      <Input
                        readOnly={readOnly}
                        placeholder="title"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                key={'url1' + field.id}
                name={`extra.${index}.url`}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormControl>
                      <Input readOnly={readOnly} placeholder="url" {...field} />
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
              onClick={() => skip.append({ title: '', url: '' })}
            >
              添加跳过项目
            </Button>
          </div>
          {skip.fields.map((field, index) => (
            <div className="grid grid-cols-3 gap-4 items-end" key={field.id}>
              <FormField
                control={form.control}
                key={'title2' + field.id}
                name={`skip.${index}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex items-center">
                        <div className="flex-1">{`跳过#${index + 1}`} </div>
                        <Button type="button" variant="ghost">
                          <Trash2
                            onClick={() =>
                              toast({
                                description: '确定要删除吗？',
                                action: (
                                  <ToastAction
                                    altText="删除"
                                    onClick={() => skip.remove(index)}
                                  >
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
                      <Input
                        readOnly={readOnly}
                        placeholder="title"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                key={'url2' + field.id}
                name={`skip.${index}.url`}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormControl>
                      <Input readOnly={readOnly} placeholder="url" {...field} />
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
              onClick={() => titleContain.append({ str: '' })}
            >
              添加标题关键字
            </Button>
          </div>
          {titleContain.fields.map((field, index) => (
            <FormField
              control={form.control}
              key={'title3' + field.id}
              name={`title_contain.${index}.str`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex items-center">
                      <div className="flex-1">{`关键字#${index + 1}`} </div>
                      <Button type="button" variant="ghost">
                        <Trash2
                          onClick={() =>
                            toast({
                              description: '确定要删除吗？',
                              action: (
                                <ToastAction
                                  altText="删除"
                                  onClick={() => titleContain.remove(index)}
                                >
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
                    <Input readOnly={readOnly} placeholder="title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </>

        <FormField
          control={form.control}
          name="external_subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>外置字幕</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
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

export default MikanForm
