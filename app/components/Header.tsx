import Link from "next/link"

const Header = () => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          RestaurantApp
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/pedidos">Pedidos</Link>
          </li>
          <li>
            <Link href="/inventario">Inventario</Link>
          </li>
          <li>
            <Link href="/reportes">Reportes</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header

