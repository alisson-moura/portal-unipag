import { ListaEstabelecimentos } from './lista';

export function EstabelecimentosPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Estabelecimentos</h1>
      <ListaEstabelecimentos />
    </div>
  );
}

export default EstabelecimentosPage; 