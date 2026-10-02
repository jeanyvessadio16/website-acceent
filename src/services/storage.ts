import { supabase } from '@/lib/supabase'

export async function uploadPostImage(file: File): Promise<string> {
    if (!file) {
        throw new Error("Aucun fichier sélectionné.")
    }

    // 1. Nettoyer le nom du fichier et générer un identifiant unique (Timestamp + Hash)
    const rawExt = file.name.split('.').pop() || 'png'
    const fileExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '')
    const baseName = file.name.includes('.') 
        ? file.name.substring(0, file.name.lastIndexOf('.'))
        : file.name;
    const cleanFileName = baseName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 40) // limiter la longueur du nom

    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    const filePath = `articles/${cleanFileName}-${uniqueId}.${fileExt}`

    // 2. Envoyer le fichier dans le bucket "news-images"
    const { error } = await supabase.storage
        .from('news-images')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        })

    if (error) {
        console.error('[Supabase Upload Error]', error)
        throw new Error(`Échec du téléversement Supabase : ${error.message}`)
    }

    // 3. Récupérer l'URL publique de l'image téléversée
    const { data: publicUrlData } = supabase.storage
        .from('news-images')
        .getPublicUrl(filePath)

    if (!publicUrlData?.publicUrl) {
        throw new Error("L'URL publique n'a pas pu être générée.")
    }

    return publicUrlData.publicUrl
}

