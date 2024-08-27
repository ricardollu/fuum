import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { config_storage_key, configSchema, default_config, Config, ApiResponse } from '@/lib/types'
import { storage } from 'wxt/storage'
import { toast } from '@/components/ui/use-toast'
import { api } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

export default function FuumTab() {
  const form = useForm<z.infer<typeof configSchema>>({
    resolver: zodResolver(configSchema),
    defaultValues: default_config(),
  })

  function onSubmit(values: z.infer<typeof configSchema>) {
    storage.setItem<Config>(config_storage_key, values).then(() => {
      toast({
        description: '保存成功',
      })
    })
  }

  function requestCheck() {
    api<ApiResponse>(form.getValues('muuf_api_endpoint') + '/request-check', {
      method: 'POST',
    }).then(() => {
      toast({
        description: '请求成功',
      })
    })
  }

  useEffect(() => {
    storage
      .getItem<Config>(config_storage_key, {
        fallback: default_config(),
      })
      .then((config) => {
        if (config) {
          form.reset(config)
        }
      })
  }, [])

  return (
    <div className="space-y-2 mx-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="muuf_api_endpoint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>muuf api endpoint</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">保存</Button>
        </form>
      </Form>
      <Separator />
      <div className="flex items-center">
        <div className="flex-1 text-base">request muuf to do check</div>
        <Button onClick={() => requestCheck()}>request check</Button>
      </div>
    </div>
  )
}
