/** Carga de Configuraciones > Chatbot para clientes: las mismas tarjetas, en gris */
export function ChatbotSettingsSkeleton() {
  const card = (rows: number, key: number) => (
    <div key={key} className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 bg-bg-subtle/60 border-b-2 border-bg-subtle">
        <div className="w-8 h-8 rounded-lg bg-bg-subtle" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3.5 bg-bg-subtle rounded-md w-1/3" />
          <div className="h-3 bg-bg-subtle rounded-md w-2/3" />
        </div>
      </div>
      <div className="p-4 space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 bg-bg-subtle rounded-md w-2/5" />
              <div className="h-3 bg-bg-subtle rounded-md w-4/5" />
            </div>
            <div className="h-5 w-9 bg-bg-subtle rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10 animate-pulse">
      <div className="md:col-span-6 md:border-r md:border-primary">
        <div className="h-6 bg-bg-subtle rounded-md w-1/2 m-4" />
        <div className="mx-4 space-y-4">{[1, 3, 2].map((rows, index) => card(rows, index))}</div>
      </div>
      <div className="md:col-span-4">
        <div className="h-6 bg-bg-subtle rounded-md w-1/3 m-4" />
        <div className="px-4 space-y-2">
          {[0, 1, 2, 3].map((index) => <div key={index} className="h-14 bg-bg-subtle rounded-lg" />)}
        </div>
      </div>
    </div>
  );
}
