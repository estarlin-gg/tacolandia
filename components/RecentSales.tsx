import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppContext } from "@/app/context/AppContext";

export function RecentSales() {
  const { obtenerVentasRecientes } = useAppContext();
  const ventasRecientes = obtenerVentasRecientes();

  return (
    <div className="space-y-8">
      {ventasRecientes.map((venta, index) => (
        <div key={venta.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{`M${venta.mesa}`}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              Mesa {venta.mesa}
            </p>
            <p className="text-sm text-muted-foreground">
              {new Date(venta.tiempoInicio).toLocaleString()}
            </p>
          </div>
          <div className="ml-auto font-medium">
            +${(venta.total ?? 0).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
