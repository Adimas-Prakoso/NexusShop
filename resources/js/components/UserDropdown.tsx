import { Link, router } from '@inertiajs/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, Settings, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface User {
  name: string;
  email: string;
}

interface UserDropdownProps {
  user: User;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function UserDropdown({ user }: UserDropdownProps) {
  const handleLogout = () => {
    router.post('/logout');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none group">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <Avatar className="border-2 border-purple-500/30 bg-black/50 backdrop-blur-sm transition-all duration-300 group-hover:border-purple-400/50">
            <AvatarFallback className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white font-bold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 blur transition-opacity duration-300 group-hover:opacity-20" />
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-64 bg-black/90 backdrop-blur-xl border border-purple-500/20 shadow-lg shadow-purple-500/10"
      >
        <div className="p-4 bg-gradient-to-br from-purple-900/50 via-indigo-900/50 to-blue-900/50">
          <div className="flex flex-col space-y-1">
            <p className="text-base font-medium text-white">{user.name}</p>
            <p className="text-sm text-purple-200/70">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator className="bg-purple-500/20" />
        <div className="p-2">
          <DropdownMenuItem asChild>
            <Link 
              href="/profile" 
              className="flex items-center gap-2 px-3 py-2 text-sm text-purple-100 hover:bg-purple-500/20 rounded-md transition-colors duration-200"
            >
              <Settings className="w-4 h-4 text-purple-400" />
              Profile Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link 
              href="/orders" 
              className="flex items-center gap-2 px-3 py-2 text-sm text-purple-100 hover:bg-purple-500/20 rounded-md transition-colors duration-200"
            >
              <Clock className="w-4 h-4 text-purple-400" />
              Purchase History
            </Link>
          </DropdownMenuItem>
        </div>
        <DropdownMenuSeparator className="bg-purple-500/20" />
        <div className="p-2">
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-300 hover:text-red-200 hover:bg-red-500/20 rounded-md transition-colors duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 