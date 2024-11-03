import { encrypt, decrypt, refershSession } from '@/lib/auth.serverless';
import { NextRequest, NextResponse } from 'next/server';

describe('auth.serverless.ts', () => {
	describe('encrypt', () => {
		it('should encrypt session data into a JWT token', async () => {
			const payload = {
				name: 'Test User',
				id: 1,
				role: 'user' as const
			};
			const token = await encrypt(payload);
			expect(typeof token).toBe('string');
			expect(token.split('.').length).toBe(3);
		});
	});

	describe('decrypt', () => {
		it('should decrypt a valid JWT token', async () => {
			const payload = {
				name: 'Test User',
				id: 1,
				role: 'user' as const
			};

			const token = await encrypt(payload);
			const decrypted = await decrypt(token);

			expect(decrypted).toMatchObject({
				name: payload.name,
				id: payload.id,
				role: payload.role
			});
			expect(decrypted).toHaveProperty('exp');
			expect(decrypted).toHaveProperty('iat');
		});

		it('should throw error for invalid token', async () => {
			await expect(decrypt('invalid-token')).rejects.toThrow();
		});
	});

	describe('refershSession', () => {
		let mockRequest: jest.Mocked<NextRequest>;
		let mockResponse: jest.Mocked<NextResponse>;

		beforeEach(() => {
			mockResponse = {
				cookies: {
					set: jest.fn()
				}
			} as unknown as jest.Mocked<NextResponse>;

			jest.spyOn(NextResponse, 'next').mockImplementation(() => mockResponse);
		});

		it('should return undefined if no session cookie exists', async () => {
			mockRequest = {
				cookies: {
					get: jest.fn().mockReturnValue(undefined)
				}
			} as unknown as jest.Mocked<NextRequest>;

			const result = await refershSession(mockRequest);
			expect(result).toBeUndefined();
		});

		it('should refresh valid session and set new cookie', async () => {
			const payload = {
				name: 'Test User',
				id: 1,
				role: 'user' as const
			};
			const token = await encrypt(payload);

			mockRequest = {
				cookies: {
					get: jest.fn().mockReturnValue({ value: token })
				}
			} as unknown as jest.Mocked<NextRequest>;

			const result = await refershSession(mockRequest);
			expect(result).toBeDefined();
			expect(mockResponse.cookies.set).toHaveBeenCalledWith(
				expect.objectContaining({
					name: 'jwt-token',
					httpOnly: true
				})
			);
		});

		it('should return undefined for invalid token', async () => {
			mockRequest = {
				cookies: {
					get: jest.fn().mockReturnValue({ value: 'invalid-token' })
				}
			} as unknown as jest.Mocked<NextRequest>;

			const result = await refershSession(mockRequest);
			expect(result).toBeUndefined();
		});
	});
});
