"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Waves, Users, ShoppingBag, DollarSign } from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navigation: NavItem[] = [
  {
    name: "Alunos",
    href: "/alunos",
    icon: <Users className="w-6 h-6" />,
  },
  {
    name: "Loja",
    href: "/loja",
    icon: <ShoppingBag className="w-6 h-6" />,
  },
  {
    name: "Vendas",
    href: "/vendas",
    icon: <DollarSign className="w-6 h-6" />,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <aside
      className={cn(
        "bg-gray-50 border-r border-gray-200 min-h-screen transition-all duration-300 ease-in-out",
        isHovered ? "w-64" : "w-20"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <nav className="p-4">
        {/* Logo/Topo */}
        <div className="mb-8 flex items-center justify-center py-4">
          <div className={cn(
            "flex items-center transition-all",
            isHovered ? "gap-3" : "justify-center"
          )}>
            {/* Ícone de Onda */}
            <Waves className="w-10 h-10 text-blue-600" />
            {/* Texto RG - aparece quando expandido */}
            {isHovered && (
              <span className="text-xl font-bold text-blue-600">RG</span>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg text-sm font-medium transition-colors",
                  isHovered ? "gap-3 px-4 py-3" : "justify-center px-2 py-3",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {isHovered && <span>{item.name}</span>}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}

