interface StockCardProps {
  symbol: string;
  name: string;
  price: number | null | undefined;
}

export default function StockCard({ symbol, name, price }: StockCardProps) {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-lg">
      <h2 className="text-lg font-semibold text-white">{name}</h2>
      <p className="text-sm text-gray-400">{symbol}</p>
      <p className="mt-2 text-2xl font-bold text-green-400">{price != null ? `$${price.toFixed(2)}` : "Loading..."}</p>
    </div>
  );
}
