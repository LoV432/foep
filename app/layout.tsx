import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import { Toaster } from '@/components/ui/toaster';

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<QueryProvider>{children}</QueryProvider>
				<Toaster />
			</body>
		</html>
	);
}
