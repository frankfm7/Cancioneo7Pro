export default function ToolsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Herramientas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <div className="text-4xl mb-3">🎵</div>
          <h3 className="font-bold text-lg mb-1">Metrónomo</h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Próximamente</p>
        </div>
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <div className="text-4xl mb-3">🎸</div>
          <h3 className="font-bold text-lg mb-1">Afinador</h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Próximamente</p>
        </div>
      </div>
    </div>
  );
}
