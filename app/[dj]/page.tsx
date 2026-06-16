export default async function DJPage({
  params,
}: {
  params: Promise<{ dj: string }>;
}) {
  const { dj } = await params;

  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          DJ {dj}
        </h1>

        <p className="mb-6">
          Apoya este set en vivo 🎧
        </p>

        <button className="bg-green-500 px-6 py-3 rounded font-bold">
          Pagar
        </button>
      </div>
    </main>
  );
}