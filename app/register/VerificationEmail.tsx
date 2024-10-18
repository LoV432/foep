import * as React from 'react';

interface EmailTemplateProps {
	name: string;
	email: string;
	code: string;
}

if (!process.env.HOST_URL) {
	throw new Error('Please add HOST_URL env');
}

export const VerificationEmail: React.FC<Readonly<EmailTemplateProps>> = ({
	name,
	email,
	code
}) => (
	<div>
		<h1>
			Hello {name}, To verify your email ({email}) please click the link below.
		</h1>
		<p>
			<a href={`${process.env.HOST_URL}/register/verify/${code}`}>
				Verify Email
			</a>
		</p>
	</div>
);
