import * as React from 'react';

interface EmailTemplateProps {
	email: string;
	code: string;
}

if (!process.env.HOST_URL) {
	throw new Error('Please add HOST_URL env');
}

export const ResetPasswordEmail: React.FC<Readonly<EmailTemplateProps>> = ({
	email,
	code
}) => (
	<div>
		<h1>Hello {email}, To reset your password please click the link below.</h1>
		<p>
			<a href={`${process.env.HOST_URL}/login/reset-password/${code}`}>
				Reset Password
			</a>
		</p>
	</div>
);
