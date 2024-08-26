import { Config, config_storage_key, default_config } from '@/lib/types'

export function useConfig() {
  const [config, setConfig] = useState<Config>(default_config())
  useEffect(() => {
    storage.getItem<Config>(config_storage_key).then((c) => {
      if (c) {
        setConfig(c)
      }
    })
  }, [])
  return config
}
