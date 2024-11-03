import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { User, BookOpen, Users } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import LogoutButton from './LogoutButton';

export default function UserProfileMenu({
	userName,
	isPrivileged
}: {
	userName: string;
	isPrivileged: boolean;
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="relative h-8 w-8 rounded-full"
				>
					<Avatar>
						<AvatarFallback>
							{userName.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuItem asChild>
					<Link href="/profile">
						<User className="mr-2 h-4 w-4" />
						<span>Profile</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href="/dashboard">
						<BookOpen className="mr-2 h-4 w-4" />
						<span>Enrolled Courses</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				{isPrivileged && (
					<DropdownMenuItem asChild>
						<Link href="/admin/dashboard">
							<Users className="mr-2 h-4 w-4" />
							<span>Admin Dashboard</span>
						</Link>
					</DropdownMenuItem>
				)}
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<div>
						<LogoutButton />
					</div>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
