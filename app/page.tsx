import { destroySession, generateSession, getSession } from '@/lib/auth';

export default async function Home() {
	const session = await getSession();
	return (
		<div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 text-white sm:p-20">
			<main className="row-start-2 flex flex-col items-center gap-8 sm:items-start">
				<form action={generateSession}>
					<button type="submit">Login</button>
				</form>
				<form action={destroySession}>
					<button type="submit">Logout</button>
				</form>
				{JSON.stringify(session)}
			</main>
		</div>
	);
}
