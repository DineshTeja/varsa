'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPlayground, setIsPlayground] = useState(true);

  useEffect(() => {
    setIsPlayground(pathname === '/modelplayground');
  }, [pathname]);

  const handleSwitchChange = (checked: boolean) => {
    setIsPlayground(checked);
    if (checked) {
      router.push('/modelplayground');
    } else {
      router.push('/example');
    }
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-sm">
      <div className="flex items-center">
        <Link href="/example" className="flex items-center">
          <h2 className="text-2xl font-thin font-serif text-green-800">varsa</h2>
        </Link>
      </div>
      <div className="flex items-center space-x-2">
        <Label htmlFor="playground-mode" className={isPlayground ? "text-gray-600" : ""}>
          Example
        </Label>
        <Switch
          id="playground-mode"
          checked={isPlayground}
          onCheckedChange={handleSwitchChange}
        />
        <Label htmlFor="example-mode" className={isPlayground ? "" : "text-gray-600"}>
          Playground
        </Label>
      </div>
    </nav>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
  color?: string;
}

function NavItem({ href, icon, text, isActive, color }: NavItemProps) {
  return (
    <Link href={href} className="relative mr-4">
      <motion.div
        className={`flex items-center px-3 py-2 rounded-md ${isActive ? 'bg-gray-100' : ''} ${color}`}
        whileHover={{ backgroundColor: color ? color : 'rgba(0, 0, 0, 0.05)' }}
        animate={{ backgroundColor: isActive ? 'rgba(0, 0, 0, 0.05)' : color ? color : 'rgba(0, 0, 0, 0)' }}
      >
        {icon}
        {text}
      </motion.div>
    </Link>
  );
}