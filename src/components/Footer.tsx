'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Plus, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Footer() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      icon: Home,
      label: 'Главная',
    },
    {
      href: '/create-order',
      icon: Plus,
      label: 'Создать',
    },
    {
      href: '/my-orders',
      icon: Package,
      label: 'Мои заказы',
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 px-4 py-2">
      <nav className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors',
                isActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}

