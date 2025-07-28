import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type {
  RoomType,
  CustomizationOption,
  SpecialOffer,
  SectionConfig,
  CompatibilityRule,
  TranslationMap,
} from '@/types/supabase'

// Hook to fetch translations
export function useTranslations(language: string = 'en', category?: string) {
  const [translations, setTranslations] = useState<TranslationMap>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchTranslations() {
      try {
        setLoading(true)
        let query = supabase
          .from('translations')
          .select('key, value')
          .eq('language', language)

        if (category) {
          query = query.eq('category', category)
        }

        const { data, error } = await query

        if (error) throw error

        // Convert array to key-value map
        const translationMap: TranslationMap = {}
        data?.forEach((item) => {
          translationMap[item.key] = item.value
        })

        setTranslations(translationMap)
      } catch (err) {
        setError(err as Error)
        console.error('Error fetching translations:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTranslations()
  }, [language, category])

  return { translations, loading, error }
}

// Hook to fetch room types
export function useRoomTypes(active: boolean = true) {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchRoomTypes() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('room_types')
          .select('*')
          .eq('active', active)
          .order('base_price', { ascending: true })

        if (error) throw error

        setRoomTypes(data || [])
      } catch (err) {
        setError(err as Error)
        console.error('Error fetching room types:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRoomTypes()
  }, [active])

  return { roomTypes, loading, error }
}

// Hook to fetch customization options
export function useCustomizationOptions(category?: string, active: boolean = true) {
  const [options, setOptions] = useState<CustomizationOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchOptions() {
      try {
        setLoading(true)
        let query = supabase
          .from('customization_options')
          .select('*')
          .eq('active', active)
          .order('sort_order', { ascending: true })

        if (category) {
          query = query.eq('category', category)
        }

        const { data, error } = await query

        if (error) throw error

        setOptions(data || [])
      } catch (err) {
        setError(err as Error)
        console.error('Error fetching customization options:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOptions()
  }, [category, active])

  return { options, loading, error }
}

// Hook to fetch special offers
export function useSpecialOffers(active: boolean = true) {
  const [offers, setOffers] = useState<SpecialOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchOffers() {
      try {
        setLoading(true)
        const today = new Date().toISOString().split('T')[0]
        
        const { data, error } = await supabase
          .from('special_offers')
          .select('*')
          .eq('active', active)
          .or(`valid_from.is.null,valid_from.lte.${today}`)
          .or(`valid_until.is.null,valid_until.gte.${today}`)
          .order('sort_order', { ascending: true })

        if (error) throw error

        setOffers(data || [])
      } catch (err) {
        setError(err as Error)
        console.error('Error fetching special offers:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOffers()
  }, [active])

  return { offers, loading, error }
}

// Hook to fetch section configurations
export function useSectionConfigs(language: string = 'en') {
  const [sections, setSections] = useState<SectionConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchSections() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('section_configs')
          .select('*')
          .eq('language', language)
          .eq('active', true)
          .order('sort_order', { ascending: true })

        if (error) throw error

        setSections(data || [])
      } catch (err) {
        setError(err as Error)
        console.error('Error fetching section configs:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSections()
  }, [language])

  return { sections, loading, error }
}

// Hook to fetch compatibility rules
export function useCompatibilityRules() {
  const [rules, setRules] = useState<CompatibilityRule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchRules() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('compatibility_rules')
          .select('*')

        if (error) throw error

        setRules(data || [])
      } catch (err) {
        setError(err as Error)
        console.error('Error fetching compatibility rules:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRules()
  }, [])

  return { rules, loading, error }
}

// Combined hook for all landing page content
export function useLandingPageContent(language: string = 'en') {
  const { translations, loading: translationsLoading, error: translationsError } = useTranslations(language)
  const { roomTypes, loading: roomsLoading, error: roomsError } = useRoomTypes()
  const { options: customizationOptions, loading: customizationsLoading, error: customizationsError } = useCustomizationOptions()
  const { offers: specialOffers, loading: offersLoading, error: offersError } = useSpecialOffers()
  const { sections, loading: sectionsLoading, error: sectionsError } = useSectionConfigs(language)
  const { rules: compatibilityRules, loading: rulesLoading, error: rulesError } = useCompatibilityRules()

  const loading = translationsLoading || roomsLoading || customizationsLoading || 
                 offersLoading || sectionsLoading || rulesLoading

  const error = translationsError || roomsError || customizationsError || 
                offersError || sectionsError || rulesError

  return {
    translations,
    roomTypes,
    customizationOptions,
    specialOffers,
    sections,
    compatibilityRules,
    loading,
    error,
  }
}