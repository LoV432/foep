import { login, getSession, destroySession } from '@/lib/auth';
import { db } from '@/db/db';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { encrypt } from '@/lib/auth.serverless';

jest.mock('next/headers', () => ({
	cookies: jest.fn()
}));

jest.mock('next/navigation', () => ({
	redirect: jest.fn()
}));

jest.mock('../../db/db', () => ({
	db: {
		select: jest.fn().mockReturnThis(),
		from: jest.fn().mockReturnThis(),
		where: jest.fn()
	},
	Users: {
		email: 'email',
		user_id: 'user_id',
		name: 'name',
		password: 'password',
		role: 'role',
		email_verified: 'email_verified'
	}
}));

jest.mock('bcrypt', () => ({
	compare: jest.fn()
}));

describe('auth.ts', () => {
	let mockCookies: jest.Mocked<typeof cookies>;

	beforeEach(() => {
		jest.clearAllMocks();
		mockCookies = {
			set: jest.fn(),
			get: jest.fn(),
			delete: jest.fn()
		} as unknown as jest.Mocked<typeof cookies>;
		(cookies as jest.Mock).mockReturnValue(mockCookies);
	});

	describe('login', () => {
		const mockValues = {
			email: 'test@example.com',
			password: 'password123'
		};

		it('should successfully log in a user', async () => {
			const mockUser = {
				user_id: 1,
				name: 'Test User',
				email: 'test@example.com',
				password: 'hashedPassword',
				role: 'user' as const,
				email_verified: true
			};

			(db.where as jest.Mock).mockResolvedValue([mockUser]);
			(bcrypt.compare as jest.Mock).mockResolvedValue(true);

			const result = await login({ values: mockValues });

			expect(result).toEqual({
				success: true,
				message: 'Login successful'
			});
			expect(mockCookies.set).toHaveBeenCalled();
		});

		it('should redirect after successful login if redirectTo is provided', async () => {
			const mockUser = {
				user_id: 1,
				name: 'Test User',
				email: 'test@example.com',
				password: 'hashedPassword',
				role: 'user' as const,
				email_verified: true
			};

			(db.where as jest.Mock).mockResolvedValue([mockUser]);
			(bcrypt.compare as jest.Mock).mockResolvedValue(true);

			await login({ values: mockValues, redirectTo: '/dashboard' });

			expect(redirect).toHaveBeenCalledWith('/dashboard');
		});

		it('should return error for non-existent user', async () => {
			(db.where as jest.Mock).mockResolvedValue([]);

			const result = await login({ values: mockValues });

			expect(result).toEqual({
				success: false,
				message:
					'Something went wrong. Please double check your credentials and try again.'
			});
		});

		it('should return error for incorrect password', async () => {
			const mockUser = {
				user_id: 1,
				name: 'Test User',
				email: 'test@example.com',
				password: 'hashedPassword',
				role: 'user' as const,
				email_verified: true
			};

			(db.where as jest.Mock).mockResolvedValue([mockUser]);
			(bcrypt.compare as jest.Mock).mockResolvedValue(false);

			const result = await login({ values: mockValues });

			expect(result).toEqual({
				success: false,
				message:
					'Something went wrong. Please double check your credentials and try again.'
			});
		});

		it('should return error for unverified email', async () => {
			const mockUser = {
				user_id: 1,
				name: 'Test User',
				email: 'test@example.com',
				password: 'hashedPassword',
				role: 'user' as const,
				email_verified: false
			};

			(db.where as jest.Mock).mockResolvedValue([mockUser]);
			(bcrypt.compare as jest.Mock).mockResolvedValue(true);

			const result = await login({ values: mockValues });

			expect(result).toEqual({
				success: false,
				message: 'Email not verified'
			});
		});
	});

	describe('getSession', () => {
		it('should return session data for valid token', async () => {
			const mockSessionData = {
				name: 'Test User',
				id: 1,
				role: 'user' as const
			};

			const validToken = await encrypt(mockSessionData);

			mockCookies.get.mockReturnValue({ value: validToken });

			const result = await getSession();

			expect(result.success).toBe(true);
			expect(result.data).toMatchObject({
				name: mockSessionData.name,
				id: mockSessionData.id,
				role: mockSessionData.role
			});
			expect(result.data).toHaveProperty('exp');
			expect(result.data).toHaveProperty('iat');
		});

		it('should return failure when no token exists', async () => {
			mockCookies.get.mockReturnValue(undefined);

			const result = await getSession();

			expect(result).toEqual({
				success: false
			});
		});
	});

	describe('destroySession', () => {
		it('should delete the session cookie', async () => {
			await destroySession();

			expect(mockCookies.delete).toHaveBeenCalledWith('jwt-token');
		});
	});
});
