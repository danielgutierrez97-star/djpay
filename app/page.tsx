export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">DJ PAY</h1>
        <p className="mb-6">Apoya al DJ en vivo 🎧</p>

        <input
          type="number"
          placeholder="Monto (CLP)"
          className="p-3 rounded text-black mb-4 w-full"
        />

        <button className="bg-green-500 px-6 py-3 rounded font-bold">
          Pagar
        </button>
      </div>
    </main>
  );
}