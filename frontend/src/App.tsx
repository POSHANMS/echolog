function App() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="bg-surface shadow-soft rounded-2xl p-8 max-w-md">
        <h1 className="font-heading text-3xl text-text-primary mb-2">EchoLog</h1>
        <p className="font-body text-text-secondary">Theme test — terracotta accent below</p>
        <button className="mt-4 bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg shadow-lift transition-colors">
          Test Button
        </button>
      </div>
    </div>
  )
}

export default App