"use client"

import { useState } from "react"
import { useAppContext } from "../context/AppContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Pedidos() {
  const { pedidos, agregarPedido, actualizarEstadoPedido, eliminarPedido } = useAppContext()
  const [nuevoPedido, setNuevoPedido] = useState({ mesa: "", items: [] })
  const [nuevoItem, setNuevoItem] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (nuevoPedido.mesa && nuevoPedido.items.length > 0) {
      agregarPedido(nuevoPedido)
      setNuevoPedido({ mesa: "", items: [] })
    }
  }

  const addItem = () => {
    if (nuevoItem) {
      setNuevoPedido((prev) => ({ ...prev, items: [...prev.items, nuevoItem] }))
      setNuevoItem("")
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Gestión de Pedidos</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="mesa">Mesa</Label>
            <Input
              id="mesa"
              value={nuevoPedido.mesa}
              onChange={(e) => setNuevoPedido((prev) => ({ ...prev, mesa: e.target.value }))}
              placeholder="Número de mesa"
            />
          </div>
          <div>
            <Label htmlFor="item">Item</Label>
            <div className="flex space-x-2">
              <Input
                id="item"
                value={nuevoItem}
                onChange={(e) => setNuevoItem(e.target.value)}
                placeholder="Agregar item"
              />
              <Button type="button" onClick={addItem}>
                Agregar
              </Button>
            </div>
          </div>
        </div>
        <div>
          <Label>Items del pedido</Label>
          <ul className="list-disc list-inside">
            {nuevoPedido.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <Button type="submit">Crear Pedido</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mesa</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pedidos.map((pedido) => (
            <TableRow key={pedido.id}>
              <TableCell>{pedido.mesa}</TableCell>
              <TableCell>{pedido.items.join(", ")}</TableCell>
              <TableCell>
                <Select
                  value={pedido.estado}
                  onValueChange={(value) => actualizarEstadoPedido(pedido.id, value as any)}
                >
                  <SelectTrigger>
                    <SelectValue>{pedido.estado}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="preparando">Preparando</SelectItem>
                    <SelectItem value="listo">Listo</SelectItem>
                    <SelectItem value="entregado">Entregado</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => eliminarPedido(pedido.id)}>
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

