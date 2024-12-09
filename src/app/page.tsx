import AppCreator from '@/components/AppCreator'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dynamic App Builder</h1>
      <AppCreator />
    </main>
  )
}

