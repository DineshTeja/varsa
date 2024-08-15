'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    <nav className="grid grid-cols-3 items-center p-4 shadow-sm rounded-lg bg-white mx-4 my-4">
      <div className="flex items-center">
        <Link href="/example" className="flex items-center">
          <h2 className="text-2xl font-thin font-serif text-green-800">varsa</h2>
        </Link>
      </div>
      <div className="flex justify-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="px-2 sm:px-4 py-2 bg-green-50 rounded-full text-xs sm:text-sm text-green-800 flex items-center max-w-full overflow-hidden">
                <span className="flex-shrink-0">🎉</span>
                <hr className="mx-2 h-4 w-[1px] shadow-none shrink-0 bg-gray-300 hidden sm:block" />
                <span className="font-medium flex-shrink-0 hidden sm:inline">Rollout:</span>
                <span className="ml-1 truncate">
                  We now support prompt caching on Claude 3.5 Sonnet
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>We now support prompt caching on Claude 3.5 Sonnet</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex items-center justify-end space-x-2 p-2 rounded-lg">
        <Label htmlFor="playground-mode" className={`text-sm ${isPlayground ? "text-gray-600" : "text-green-800 font-medium"}`}>
          Example
        </Label>
        <Switch
          id="playground-mode"
          checked={isPlayground}
          onCheckedChange={handleSwitchChange}
          className="data-[state=checked]:bg-green-800"
        />
        <Label htmlFor="example-mode" className={`text-sm ${isPlayground ? "text-green-800 font-medium" : "text-gray-600"}`}>
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