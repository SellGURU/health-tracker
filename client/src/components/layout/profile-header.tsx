import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  Bell,
  User,
  Settings,
  LogOut,
  Crown
} from "lucide-react";

export default function ProfileHeader() {
  const [notificationCount] = useState(3);
  
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          HolistiCare
        </h1>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {notificationCount}
            </Badge>
          )}
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-blue-600 text-white">U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent className="w-64" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">Test User</p>
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  test@holisticare.com
                </p>
              </div>
            </div>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile & Settings
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem>
              <Crown className="mr-2 h-4 w-4" />
              Subscription
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}