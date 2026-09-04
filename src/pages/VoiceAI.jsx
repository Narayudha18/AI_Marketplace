import voiceAI from '../data/voice-ai.json'
import CategoryPage from './CategoryPage'

export default function VoiceAI() {
  return (
    <CategoryPage
      data={voiceAI}
      nameKey="title"
      categoryKey="voice-ai"
      label="Voice AI"
      heroTitle="Voice AI APIs & SDKs"
      heroDesc="Build speech-enabled applications with cutting-edge voice recognition, text-to-speech, and voice cloning APIs. Support 100+ languages, real-time streaming, emotion control, and custom voice creation for any use case — from IVR to audiobooks."
      heroSeed="voice-ai-hero"
      subNav={['All Voice AI', 'Speech Recognition', 'Text-to-Speech', 'Voice Cloning', 'Audio Processing']}
      footerLabel="Voice AI"
    />
  )
}
