import { Config, config_storage_key, default_config } from '@/lib/types'

export function useConfig() {
  const _default_config = default_config()
  const [config, setConfig] = useState<Config>(_default_config)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    storage
      .getItem<Config>(config_storage_key, {
        fallback: _default_config,
      })
      .then((c) => {
        if (c) {
          setConfig(c)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])
  return { config, is_config_loading: loading }
}
