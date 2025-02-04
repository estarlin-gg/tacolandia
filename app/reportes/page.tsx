"use client"

import { useAppContext } from "../context/AppContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Reportes() {
  const { pedidos, inventario } = useAppContext()

  const ventasTotales = pedidos.length
  const pedidosCompletados = pedidos.filter((pedido) => pedido.estado === "entregado").length
  const itemsBajoStock = inventario.filter((item) => item.cantidad <= item.umbralBajo).length

  const tiempoPromedioEntrega =
    pedidos
      .filter((pedido) => pedido.estado === "entregado" && pedido.tiempoInicio && pedido.tiempoFin)
      .reduce((acc, pedido) => acc + (pedido.tiempoFin! - pedido.tiempoInicio!), 0) /
    pedidosCompletados /
    60000 // en minutos

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Generación de Reportes</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ventasTotales}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Completados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pedidosCompletados}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Bajo Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{itemsBajoStock}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio de Entrega</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tiempoPromedioEntrega.toFixed(2)} min</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Productos Más Vendidos</CardTitle>
          <CardDescription>Top 5 productos más solicitados</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Cantidad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{/* Aquí iría la lógica para calcular los productos más vendidos */}</TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inventario Bajo</CardTitle>
          <CardDescription>Productos que necesitan reposición</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Cantidad Actual</TableHead>
                <TableHead>Umbral Bajo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventario
                .filter((item) => item.cantidad <= item.umbralBajo)
                .map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.nombre}</TableCell>
                    <TableCell>{item.cantidad}</TableCell>
                    <TableCell>{item.umbralBajo}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

