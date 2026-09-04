import imageGen from '../data/image-gen.json'
import CategoryPage from './CategoryPage'

export default function ImageGen() {
  return (
    <CategoryPage
      data={imageGen}
      nameKey="title"
      categoryKey="image-gen"
      label="Image Gen"
      heroTitle="AI Image Generation Tools"
      heroDesc="Generate stunning visuals with text-to-image, image editing, video generation, and 3D model APIs. Create marketing assets, product shots, concept art, and 3D prototypes with just a text prompt — powered by the latest diffusion and transformer models."
      heroSeed="image-gen-hero"
      subNav={['All Image Gen', 'Text-to-Image', 'Image Editing', 'Video Gen', '3D Models']}
      footerLabel="Image Gen"
    />
  )
}
