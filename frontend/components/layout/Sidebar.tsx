"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Waves, Users, ShoppingBag, DollarSign, Calendar, GraduationCap, LayoutDashboard, Shield, Store, ChevronDown, ChevronRight, TrendingUp } from "lucide-react";

interface NavSubItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface NavItem {
  name: string;
  href?: string;
  icon: React.ReactNode;
  subItems?: NavSubItem[];
}

const navigation: NavItem[] = [
  {
    name: "Dashboard",
    href: "/",
    icon: <LayoutDashboard className="w-6 h-6" />,
  },
  {
    name: "Alunos",
    href: "/alunos",
    icon: <Users className="w-6 h-6" />,
  },
  {
    name: "Professores",
    href: "/professores",
    icon: <GraduationCap className="w-6 h-6" />,
  },
  {
    name: "Aulas",
    href: "/aulas",
    icon: <Calendar className="w-6 h-6" />,
  },
  {
    name: "Loja",
    icon: <Store className="w-6 h-6" />,
    subItems: [
      {
        name: "Produtos",
        href: "/produtos",
        icon: <ShoppingBag className="w-5 h-5" />,
      },
      {
        name: "Vendas",
        href: "/vendas",
        icon: <DollarSign className="w-5 h-5" />,
      },
    ],
  },
  {
    name: "Guarderia",
    href: "/guarderia",
    icon: <Shield className="w-6 h-6" />,
  },
  {
    name: "Financeiro",
    href: "/financeiro",
    icon: <TrendingUp className="w-6 h-6" />,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

  // Auto-expandir submenu se algum subitem estiver ativo
  useEffect(() => {
    const activeMenus = new Set<string>();
    navigation.forEach((item) => {
      if (item.subItems) {
        const hasActiveSubItem = item.subItems.some((subItem) => {
          return pathname.startsWith(subItem.href);
        });
        if (hasActiveSubItem) {
          activeMenus.add(item.name);
        }
      }
    });
    setExpandedMenus(activeMenus);
  }, [pathname]);

  // Expandir/colapsar submenu
  const toggleSubmenu = (menuName: string) => {
    setExpandedMenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(menuName)) {
        newSet.delete(menuName);
      } else {
        newSet.add(menuName);
      }
      return newSet;
    });
  };

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
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedMenus.has(item.name);
            
            if (hasSubItems) {
              // Verificar se algum subitem está ativo
              const hasActiveSubItem = item.subItems!.some((subItem) => {
                return pathname.startsWith(subItem.href);
              });

              return (
                <div key={item.name}>
                  {/* Botão do menu principal com subitens */}
                  <button
                    onClick={() => toggleSubmenu(item.name)}
                    className={cn(
                      "w-full flex items-center rounded-lg text-sm font-medium transition-colors",
                      isHovered ? "gap-3 px-4 py-3" : "justify-center px-2 py-3",
                      hasActiveSubItem
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {isHovered && (
                      <>
                        <span className="flex-1 text-left">{item.name}</span>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="w-4 h-4 flex-shrink-0" />
                        )}
                      </>
                    )}
                  </button>

                  {/* Subitens */}
                  {isHovered && isExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.subItems!.map((subItem) => {
                        const isSubActive = pathname.startsWith(subItem.href);
                        return (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                              isSubActive
                                ? "bg-blue-600 text-white"
                                : "text-gray-700 hover:bg-gray-100"
                            )}
                          >
                            <span className="flex-shrink-0">{subItem.icon}</span>
                            <span>{subItem.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Item de menu normal (sem subitens)
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href!);
            return (
              <Link
                key={item.name}
                href={item.href!}
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
