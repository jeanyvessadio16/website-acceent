import { supabase } from '@/lib/supabase'

export async function uploadPostImage(file: File): Promise<string> {
    // 1. Nettoyer le nom du fichier et générer un identifiant unique (UUID ou Timestamp)
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = `articles/${fileName}`

    // 2. Envoyer le fichier dans le bucket "news-images"
    const { data, error } = await supabase.storage
        .from('news-images')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false // Ne pas écraser un fichier existant
        })

    if (error) {
        throw new Error(`Échec du téléversement : ${error.message}`)
    }

    // 3. Récupérer l'URL publique de l'image téléversée
    const { data: publicUrlData } = supabase.storage
        .from('news-images')
        .getPublicUrl(filePath)

    return publicUrlData.publicUrl
}
