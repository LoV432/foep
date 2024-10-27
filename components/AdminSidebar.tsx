'use client';
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminSidebar() {
	const currentPath = usePathname();
	const [isOpen, setIsOpen] = useState(false);
	const [autoFocus, setAutoFocus] = useState(true);
	useEffect(() => {
		if (window.matchMedia('(pointer: coarse)').matches) {
			setAutoFocus(false);
		}
	}, []);
	return (
		<aside className="sticky top-0 z-20 h-fit bg-white">
			<NavigationMenu className="hidden w-full max-w-full list-none flex-col pt-2 min-[1126px]:flex">
				<NavMenuItem link="/admin" currentPath={currentPath} name="Dashboard" />
				<NavMenuItem
					link="/admin/courses"
					currentPath={currentPath}
					name="Courses"
				/>
				<NavMenuItem
					link="/admin/media-manager"
					currentPath={currentPath}
					name="Media Manager"
				/>
				<NavMenuItem
					link="/admin/profile"
					currentPath={currentPath}
					name="Profile"
				/>
			</NavigationMenu>

			<NavigationMenu className="w-full max-w-full justify-start gap-3 py-1 pl-4 pt-4 text-left min-[1126px]:hidden">
				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					<SheetTrigger aria-label="Open menu">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 512 512"
							width={24}
							height={24}
						>
							<path
								fill="none"
								stroke="black"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="32"
								d="M160 144h288M160 256h288M160 368h288"
							/>
							<circle
								cx="80"
								cy="144"
								r="16"
								fill="none"
								stroke="black"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="32"
							/>
							<circle
								cx="80"
								cy="256"
								r="16"
								fill="none"
								stroke="black"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="32"
							/>
							<circle
								cx="80"
								cy="368"
								r="16"
								fill="none"
								stroke="black"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="32"
							/>
						</svg>
					</SheetTrigger>
					<SheetContent
						className="w-fit min-w-[300px]"
						side="left"
						onCloseAutoFocus={(e) => {
							if (!autoFocus) e.preventDefault();
						}}
					>
						<DialogTitle hidden>
							<DialogDescription>Mobile Navbar</DialogDescription>
						</DialogTitle>
						<NavigationMenuList className="float-left flex-col gap-5 space-x-0">
							<NavMenuItem
								link="/admin"
								currentPath={currentPath}
								name="Dashboard"
								onClick={() => setIsOpen(false)}
							/>
							<NavMenuItem
								link="/admin/course"
								currentPath={currentPath}
								name="Course"
								onClick={() => setIsOpen(false)}
							/>
							<NavMenuItem
								link="/admin/media-manager"
								currentPath={currentPath}
								name="Media Manager"
								onClick={() => setIsOpen(false)}
							/>
							<NavMenuItem
								link="/admin/profile"
								currentPath={currentPath}
								name="Profile"
								onClick={() => setIsOpen(false)}
							/>
						</NavigationMenuList>
					</SheetContent>
				</Sheet>
			</NavigationMenu>
		</aside>
	);
}

function NavMenuItem({
	link,
	currentPath,
	name,
	onClick
}: {
	link: string;
	currentPath: string;
	name: string;
	onClick?: () => void;
}) {
	return (
		<NavigationMenuItem {...{ onClick }} className="w-full">
			<Link href={link} legacyBehavior passHref>
				<NavigationMenuLink
					className={`${navigationMenuTriggerStyle()} !w-full !justify-start rounded-none text-2xl font-semibold ${currentPath.split('/')[2] === link.split('/')[2] ? 'bg-primary/10 text-primary' : 'text-black'}`}
				>
					{name}
				</NavigationMenuLink>
			</Link>
		</NavigationMenuItem>
	);
}
