'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";

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
    <nav className="flex items-center justify-between px-3 py-2 shadow-xs rounded-md bg-white/95 mx-2 my-2 border border-gray-100">
      <div className="flex items-center">
        <h2 className="text-xl font-thin font-serif text-green-800">varsa</h2>
      </div>

      <div className="flex items-center space-x-4">
        <Dialog>
          <DialogTrigger>
            <div className="text-green-800 hover:text-green-700 rounded-md flex items-center gap-1.5 text-sm">
              <span className="text-xs font-medium">Learn More ♡</span>
              <Image src="/dineshprofile.png" alt="Varsa" width={20} height={20} className="rounded-full" />
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-green-800">Welcome to Varsa</DialogTitle>
              <DialogDescription>
                <p className="mt-2 text-sm text-gray-600">
                  Varsa is your playground for comparing LLMs across different providers. Here&apos;s how to get started:
                </p>
                <ol className="mt-3 space-y-1 text-sm text-gray-600 list-decimal list-inside">
                  <li>Enter your API keys (don&apos;t worry, we never store them)</li>
                  <li>Select the models you want to compare</li>
                  <li>(Optional) Select the benchmark you want to use</li>
                  <li>Input your prompt(s)/context and hit &quot;Run&quot;</li>
                </ol>
                <p className="mt-3 text-sm text-gray-600">
                  Compare output quality, response time, and cost across models to find the best fit for your needs.
                </p>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900">About me!</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Hi, I&apos;m Dinesh, a CS student at Harvard. I built Varsa to make it easy for developers and researchers to evaluate different LLMs side by side.
                  </p>
                  <p className="mt-1 text-sm text-green-800 font-medium">
                    (It&apos;s been done before, but I wanted my own lol).
                  </p>
                </div>
                <div className="mt-4">
                  <a
                    href="https://github.com/DineshTeja/varsa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-green-800 hover:text-green-700"
                  >
                    View on GitHub
                    <svg className="ml-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                  </a>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
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