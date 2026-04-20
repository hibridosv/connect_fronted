import { usePercentSalesTypeLogic } from '@/hooks/order/restaurant/usePercentSalesTypeLogic';

const barColors = [
  'bg-lime-500',
  'bg-red-500',
  'bg-cyan-500',
  'bg-gray-500',
  'bg-purple-500',
];

export function PercentSalesType() {
  const { percentages } = usePercentSalesTypeLogic();

  if (percentages.length === 0) return null;

  return (
    <div className="m-2 h-5 flex rounded-md overflow-hidden shadow-md">
      {percentages.map((item: any, index: number) => {
        if (item.quantity <= 0) return null;
        return (
          <div key={index} className={`h-full flex items-center justify-center text-white text-sm font-semibold transition-all duration-300 ease-in-out ${barColors[index % barColors.length]}`} style={{ width: `${item.quantity}%` }}>
            {item.quantity}%
          </div>
        );
      })}
    </div>
  );
}
