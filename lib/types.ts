import { z } from 'zod'

const strArrSchema = z.array(
  z.object({
    str: z.string(),
  }),
)

export interface MikanItem {
  title: string
  url: string
}

export interface Mikan {
  url: string
  name: string
  extra: MikanItem[]
  skip: MikanItem[]
  title_contain: string[]
  external_subtitle: boolean
}

export const default_mikan: () => Mikan = () => ({
  url: '',
  name: '',
  extra: [],
  skip: [],
  title_contain: [],
  external_subtitle: false,
})

const mikanItemSchema = z.object({
  title: z.string(),
  url: z.string(),
})

export const mikanSchema = z.object({
  url: z.string().min(1),
  name: z.string().min(1),
  extra: z.array(mikanItemSchema),
  skip: z.array(mikanItemSchema),
  title_contain: strArrSchema,
  external_subtitle: z.boolean(),
})

interface SeasonFolder {
  season: number
  folder: string
}

const seasonFolderSchema = z.object({
  season: z.coerce.number(),
  folder: z.string(),
})

interface SpecialMapping {
  name: string
  file_name: string
  match_and_replace: boolean
}

const specialMappingSchema = z.object({
  name: z.string().min(1),
  file_name: z.string().min(1),
  match_and_replace: z.boolean(),
})

export interface Collection {
  torrent_url: string
  name: string
  title: string
  season_folders: SeasonFolder[]
  special_mappings: SpecialMapping[]
  external_subtitle: boolean
}

export const default_collection: () => Collection = () => ({
  torrent_url: '',
  name: '',
  title: '',
  season_folders: [],
  special_mappings: [],
  external_subtitle: false,
})

export const collectionSchema = z.object({
  torrent_url: z.string().min(1),
  name: z.string().min(1),
  title: z.string().min(1),
  season_folders: z.array(seasonFolderSchema),
  special_mappings: z.array(specialMappingSchema),
  external_subtitle: z.boolean(),
})

export interface Config {
  muuf_api_endpoint: string
}

export const default_config: () => Config = () => ({
  muuf_api_endpoint: 'http://localhost:3000',
})

export const configSchema = z.object({
  muuf_api_endpoint: z.string().min(1),
})

export const config_storage_key = 'sync:config'

export interface ApiResponse {
  message: string
}
