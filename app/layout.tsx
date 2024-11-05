import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import { Toaster } from '@/components/ui/toaster';
import NavLoaderProvider from '@/providers/NavigationLoaderProvider';

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<QueryProvider>
					<NavLoaderProvider>{children}</NavLoaderProvider>
				</QueryProvider>
				<Toaster />
			</body>
		</html>
	);
}
