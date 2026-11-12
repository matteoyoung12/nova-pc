import { useCurrency } from "../context/CurrencyContext";
import { FuturisticBuilder } from "./FuturisticBuilder";
export function CurrencyBuilder(props) {
  const { currency } = useCurrency();
  return <FuturisticBuilder key={currency} {...props} />;
}
