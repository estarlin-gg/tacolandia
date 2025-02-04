"use client"

import { useState } from "react"
import { useAppContext } from "../context/AppContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Inventario() {
  const { inventario, agregarItemInventario, actualizarInventario, eliminarItemInventario } = useAppContext()
  const [nuevoItem, setNuevoItem] = useState({ nombre: "", cantidad: 0, umbralBajo: 0 })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (nuevoItem.nombre && nuevoItem.cantidad > 0 && nuevoItem.umbralBajo > 0) {
      agregarItemInventario(nuevoItem)
      setNuevoItem({ nombre: "", cantidad: 0, umbralBajo: 0 })
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Control de Inventario</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="nombre">Nombre del Producto</Label>
            <Input
              id="nombre"
              value={nuevoItem.nombre}
              onChange={(e) => setNuevoItem((prev) => ({ ...prev, nombre: e.target.value }))}
              placeholder="Nombre del producto"
            />
          </div>
          <div>
            <Label htmlFor="cantidad">Cantidad</Label>
            <Input
              id="cantidad"
              type="number"
              value={nuevoItem.cantidad}
              onChange={(e) => setNuevoItem((prev) => ({ ...prev, cantidad: Number(e.target.value) }))}
              placeholder="Cantidad"
            />
          </div>
          <div>
            <Label htmlFor="umbralBajo">Umbral Bajo</Label>
            <Input
              id="umbralBajo"
              type="number"
              value={nuevoItem.umbralBajo}
              onChange={(e) => setNuevoItem((prev) => ({ ...prev, umbralBajo: Number(e.target.value) }))}
              placeholder="Umbral bajo"
            />
          </div>
        </div>
        <Button type="submit">Agregar Item</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Umbral Bajo</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventario.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.nombre}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={item.cantidad}
                  onChange={(e) => actualizarInventario(item.id, Number(e.target.value))}
                  className="w-20"
                />
              </TableCell>
              <TableCell>{item.umbralBajo}</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => eliminarItemInventario(item.id)}>
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

