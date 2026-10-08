"use client";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>

          {/* Site Name */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 text-xl font-bold tracking-tight text-gray-900"
          >
            FreeStore
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            >
            <ShoppingCart size={21} />
            <span className="hidden sm:inline">Cart</span>
            </Link>
        </div>
      </header>

      {/* Overlay */}
      {menuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMenu}
          className="fixed inset-0 z-40 bg-black/40"
        />
      )}

      {/* Side Menu */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 bg-white shadow-2xl transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Menu Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-5">
          <span className="text-lg font-bold text-gray-900">
            FreeStore
          </span>

          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-2xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            ×
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <Link
            href="/"
            onClick={closeMenu}
            className="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
          >
            Home
          </Link>

          <Link
            href="/product"
            onClick={closeMenu}
            className="mt-1 block rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
          >
            Products
          </Link>

          <Link
            href="/contact"
            onClick={closeMenu}
            className="mt-1 block rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
          >
            Contact
          </Link>
        </nav>
      </aside>
    </>
  );
}