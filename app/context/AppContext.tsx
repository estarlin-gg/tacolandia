"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

type Pedido = {
  id: number
  mesa: string
  items: string[]
  estado: "pendiente" | "preparando" | "listo" | "entregado"
  tiempoInicio: number
  tiempoFin?: number
  total: number
}

type InventarioItem = {
  id: number
  nombre: string
  cantidad: number
  umbralBajo: number
}

type AppContextType = {
  pedidos: Pedido[]
  inventario: InventarioItem[]
  setPedidos: React.Dispatch<React.SetStateAction<Pedido[]>>
  setInventario: React.Dispatch<React.SetStateAction<InventarioItem[]>>
  agregarPedido: (pedido: Omit<Pedido, "id" | "estado" | "tiempoInicio">) => void
  actualizarEstadoPedido: (id: number, nuevoEstado: Pedido["estado"]) => void
  eliminarPedido: (id: number) => void
  agregarItemInventario: (item: Omit<InventarioItem, "id">) => void
  actualizarInventario: (id: number, cantidad: number) => void
  eliminarItemInventario: (id: number) => void
  calcularVentasTotales: () => number
  calcularPedidosCompletados: () => number
  calcularTiempoPromedioEntrega: () => number
  calcularProductosActivos: () => number
  obtenerVentasPorDia: () => { name: string; total: number }[]
  obtenerVentasRecientes: () => Pedido[]
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [inventario, setInventario] = useState<InventarioItem[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const storedPedidos = localStorage.getItem("pedidos")
    const storedInventario = localStorage.getItem("inventario")
    if (storedPedidos) setPedidos(JSON.parse(storedPedidos))
    if (storedInventario) setInventario(JSON.parse(storedInventario))
  }, [])

  useEffect(() => {
    localStorage.setItem("pedidos", JSON.stringify(pedidos))
    localStorage.setItem("inventario", JSON.stringify(inventario))
  }, [pedidos, inventario])

  const agregarPedido = (pedido: Omit<Pedido, "id" | "estado" | "tiempoInicio">) => {
    const nuevoPedido: Pedido = {
      ...pedido,
      id: Date.now(),
      estado: "pendiente",
      tiempoInicio: Date.now(),
    }
    setPedidos((prev) => [...prev, nuevoPedido])
    toast({
      title: "Nuevo pedido creado",
      description: `Mesa ${pedido.mesa}: ${pedido.items.join(", ")}`,
    })
  }

  const actualizarEstadoPedido = (id: number, nuevoEstado: Pedido["estado"]) => {
    setPedidos((prev) =>
      prev.map((pedido) =>
        pedido.id === id
          ? { ...pedido, estado: nuevoEstado, tiempoFin: nuevoEstado === "entregado" ? Date.now() : pedido.tiempoFin }
          : pedido,
      ),
    )
    if (nuevoEstado === "listo") {
      toast({
        title: "Pedido listo para servir",
        description: `El pedido de la mesa ${pedidos.find((p) => p.id === id)?.mesa} está listo`,
      })
    }
  }

  const eliminarPedido = (id: number) => {
    setPedidos((prev) => prev.filter((pedido) => pedido.id !== id))
  }

  const agregarItemInventario = (item: Omit<InventarioItem, "id">) => {
    setInventario((prev) => [...prev, { ...item, id: Date.now() }])
  }

  const actualizarInventario = (id: number, cantidad: number) => {
    setInventario((prev) => prev.map((item) => (item.id === id ? { ...item, cantidad } : item)))
    const item = inventario.find((i) => i.id === id)
    if (item && cantidad <= item.umbralBajo) {
      toast({
        title: "Alerta de stock bajo",
        description: `${item.nombre} está por debajo del umbral mínimo`,
        variant: "destructive",
      })
    }
  }

  const eliminarItemInventario = (id: number) => {
    setInventario((prev) => prev.filter((item) => item.id !== id))
  }

  const calcularVentasTotales = () => {
    return pedidos.reduce((total, pedido) => total + pedido.total, 0)
  }

  const calcularPedidosCompletados = () => {
    return pedidos.filter((pedido) => pedido.estado === "entregado").length
  }

  const calcularTiempoPromedioEntrega = () => {
    const pedidosEntregados = pedidos.filter((pedido) => pedido.estado === "entregado" && pedido.tiempoFin)
    if (pedidosEntregados.length === 0) return 0
    const tiempoTotal = pedidosEntregados.reduce(
      (total, pedido) => total + (pedido.tiempoFin! - pedido.tiempoInicio),
      0,
    )
    return tiempoTotal / pedidosEntregados.length / 60000 // en minutos
  }

  const calcularProductosActivos = () => {
    return inventario.length
  }

  const obtenerVentasPorDia = () => {
    const hoy = new Date()
    const ultimosSieteDias = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(hoy)
      d.setDate(hoy.getDate() - i)
      return d.toLocaleDateString("es-ES", { weekday: "short" })
    }).reverse()

    const ventasPorDia = ultimosSieteDias.map((dia) => {
      const ventasDelDia = pedidos
        .filter((pedido) => {
          const fechaPedido = new Date(pedido.tiempoInicio).toLocaleDateString("es-ES", { weekday: "short" })
          return fechaPedido === dia
        })
        .reduce((total, pedido) => total + pedido.total, 0)

      return { name: dia, total: ventasDelDia }
    })

    return ventasPorDia
  }

  const obtenerVentasRecientes = () => {
    return pedidos.slice(-5).reverse()
  }

  return (
    <AppContext.Provider
      value={{
        pedidos,
        inventario,
        setPedidos,
        setInventario,
        agregarPedido,
        actualizarEstadoPedido,
        eliminarPedido,
        agregarItemInventario,
        actualizarInventario,
        eliminarItemInventario,
        calcularVentasTotales,
        calcularPedidosCompletados,
        calcularTiempoPromedioEntrega,
        calcularProductosActivos,
        obtenerVentasPorDia,
        obtenerVentasRecientes,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}

