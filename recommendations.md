1. **Password Hashing (userModel.js, lines 58-72): The project uses a simple hash without salting, which is inadequate for production environments. Implementing bcrypt with a strong salt would significantly enhance password security.**

   - It seems there might be a misunderstanding here regarding bcrypt. Bcrypt inherently includes a salt within its hash, so additional salting is not necessary. You might find these resources helpful in understanding how bcrypt works:

     - [https://shorturl.at/oooxS](https://shorturl.at/oooxS)
     - [https://codahale.com/how-to-safely-store-a-password/](https://codahale.com/how-to-safely-store-a-password/)
     - [https://www.usenix.org/legacy/events/usenix99/provos/provos_html/node6.html#SECTION00051000000000000000](https://www.usenix.org/legacy/events/usenix99/provos/provos_html/node6.html#SECTION00051000000000000000)
     - [https://www.npmjs.com/package/bcrypt](https://www.npmjs.com/package/bcrypt)

1. **Session Management (auth.js): There is a lack of token expiration handling. Tokens should be set to expire within a defined timeframe to prevent session hijacking, especially in case of user inactivity. Adding JWT expiration with refresh tokens is recommended for robust session management.**

   - The expiration time is already set to 12 hours. This is clearly defined in the `auth.serverless.ts, lines 16-24`.

     ```ts
     const SESSION_TIMEOUT = '12h'; // <-- This is the expiration time
     export async function encrypt(payload: SessionData) {
     	return await new SignJWT(payload)
     		.setProtectedHeader({ alg: 'HS256' })
     		.setIssuedAt()
     		.setExpirationTime(SESSION_TIMEOUT) // <-- It's being set here
     		.sign(key);
     }
     ```

   - I have also set the expiration for the cookie too in the `auth.ts, lines 60-65` file.

     ```ts
     const expires = new Date(Date.now() + ms(SESSION_TIMEOUT)).getTime(); // <-- This is the expiration time
     cookies().set('jwt-token', token, {
     	expires, // <-- It's being set here
     	httpOnly: true,
     	secure: process.env.NODE_ENV === 'production'
     });
     ```

   - And finally the refresh token logic is split between `auth.serverless.ts, lines 33-53` and `middleware.ts` file.

1. **Image Loading (front-end, public/assets): Images are loaded without any lazy loading mechanism, which slows down page loading speeds, especially on mobile devices. Lazy loading could improve performance on slower connections and enhance user experience.**

   - This seems to overlook that Next.js `<Image>` components perform lazy loading by default. You can verify this by inspecting the HTML output on the site, where all images will have lazy loading attributes. Additional details can be found here: [https://nextjs.org/docs/app/api-reference/components/image#loading](https://nextjs.org/docs/app/api-reference/components/image#loading).

1. **CSS Practices (styles.css, lines 210-250): CSS is not modular and lacks a structured approach, leading to repetitive styles. Using a CSS preprocessor (like SASS) or following a BEM methodology would improve style organisation and reduce duplication**

   - It seems the reviewer may have overlooked that TailwindCSS is used in this project, which eliminates the need for such practices. The file and lines referred to do not exist in the codebase, possibly because they are viewing the compiled CSS file somehow? Perhaps GPT was used to review the codebase?

     - [https://tailwindcss.com/](https://tailwindcss.com/)

1. **Testing (No Test Cases): No unit tests were found in the repository. Unit tests should be implemented for critical features, such as authentication and permissions. A file such as `auth.test.js` could verify expected outcomes for each auth state, while `course.test.js` could handle the main course management logic.**

   - While I agree that test coverage could be expanded, it's incorrect to say that there are no tests. I have tests for the complete auth flow. You can see them under `/__tests__/` folder, which funnily enough does contain a file called `auth.test.ts`.

1. **Lack of Input Sanitisation (courseController.js, lines 35-57): This file demonstrates unsafe handling of user input, leaving the application vulnerable to SQL injection attacks. Input validation and parameterised queries should be standard practice to protect against such vulnerabilities.**

   - The specific file and line references do not seem to exist in the codebase. I have reviewed all my DB queries again and found none that are vulnerable to SQL injection attacks (I am not a security expert so I might be wrong). So I would appreciate if you could point out the vulnerability in the code.

1. **Database Queries (courseModel.js, lines 100-140): There is a lack of efficient query handling for course data retrieval. Implementing pagination, as specified in the project, would prevent performance bottlenecks when querying large datasets.**

   - The specific file and line references do not seem to exist in the codebase so I am not sure what this is referring to, but just to be clear I have added pagination to all the queries I believed could have been improved. You can see the pagination code in numerous files like `/lib/get_courses.ts`, `/app/admin/media-manager/page.tsx`, etc.

1. **Caching (dashboardController.js, lines 85-120): There is no caching mechanism for frequently accessed data like the user dashboard or course lists. A Redis cache could be implemented here to reduce server load and improve response times.**

   - The specific file and line references do not seem to exist in the codebase, but I understand what this is referring to and it should probably have had a cache but the problem is that this recommdation makes it seem like there is no caching at all, which is not true. I have added cache in numerous places in the codebase. You can see some expamples in `app/api/courses/route.ts` and `app/course/[slug]/page.tsx, Lines 38-41`. You can also see the `withCache` function in `lib/with-cache.ts`. It uses NextJS built-in caching mechanisms.

1. **Authentication Module (auth.js): The authentication logic could be modularised further. Lines 42-67 show repeated code for handling permissions, which would benefit from a helper function to centralise role validation logic. This would improve code readability and reduce redundancy.**

   - Assuming this refers to `/lib/auth.ts`, the code on the lines mentioned above is this:

     ```ts
       // TODO:
       // No point of checking the password if the user is not verified
       // But i haven't really thought this through yet.
       if (!user[0].email_verified) {
         throw new Error('Email not verified');
       }

       const isPasswordCorrect = await bcrypt.compare(password, user[0].password);
       if (!isPasswordCorrect) {
         throw new Error('Incorrect password');
       }

       const token = await encrypt({
         name: user[0].name,
         id: user[0].user_id,
         role: user[0].role
       });
       const expires = new Date(Date.now() + ms(SESSION_TIMEOUT)).getTime();
       cookies().set('jwt-token', token, {
         expires,
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production'
       });

       if (redirectTo) {
     ```

     This is a pretty simple guard clause style of validation. I don't see any helpful way to modularise this logic any further. This logic isn't used anywhere else in the codebase. So I would appreciate if you could clarify what this is referring to.

1. **CMS Backend Structure (cms.js): The backend CMS logic, particularly around course creation and management, lacks separation of concerns. In lines 120-160, for example, both data validation and storage logic are handled in the same function. Ideally, data validation should be handled in a middleware function or separate utility, keeping the main controller function cleaner.**

   - I am unsure what file this is referring to but my best guess is that it is referring to the `/app/admin/courses/add/create_course_action.ts` file. Which has to following code:

     ```ts
     'use server';
     // Imports removed for brevity

     export async function createCourseAction(
     	data: z.infer<typeof addCourseSchema>
     ) {
     	try {
     		const session = await getSession();
     		if (
     			!session.success ||
     			(session.data.role !== 'instructor' && session.data.role !== 'admin')
     		) {
     			throw new Error('Unauthorized');
     		}
     		const parsedData = addCourseSchema.parse(data);

     		const course = await db
     			.insert(Courses)
     			.values({
     				category_id: parseInt(parsedData.category),
     				name: parsedData.name,
     				price: parseFloat(parsedData.price),
     				short_description: parsedData.shortDescription,
     				long_description: parsedData.largeDescription,
     				image_url: parsedData.imageUrl,
     				is_draft: parsedData.isDraft,
     				author_id: session.data.id,
     				slug: kebabCase(parsedData.name) + '-' + randomUUID()
     			})
     			.returning();
     		revalidateTag('all-courses-page');
     		return {
     			success: true as const,
     			course
     		};
     	} catch (error) {
     		console.error(error);
     		return {
     			success: false as const,
     			message: 'Failed to create course'
     		};
     	}
     }
     ```

     This to me seems like a very standard API endpoint which is used to create a new course. Perhaps the reviewer didn't realise that this is not a normal function, but rather a POST API endpoint which is denoted by the `use server` directive at the top of the file. You can read more about `server functions` here: [https://react.dev/reference/rsc/server-functions](https://react.dev/reference/rsc/server-functions).

1. **Documentation (README.md): The documentation does not provide a thorough explanation of the project structure, making it difficult for other developers to navigate and understand. More detailed comments, especially in complex functions like those in cms.js (lines 120-160), are recommended to clarify the developer's intentions.**

   - I would largely agree. I could definitely make the documentation more detailed.

1. **Variable Naming (multiple files): The use of non-descriptive variable names (e.g., `var1`, `tempData`) in files like `userController.js` and `dashboard.js` reduces code readability. Descriptive names that reflect the variable's purpose should be used to improve maintainability.**

   - A quick search on the codebase returns 0 results for `var1` and `tempData`. So I am not sure what this is referring to.

1. **Error Handling (auth.js, lines 50-80): Error handling is not consistent. Instead of logging errors to the console, which exposes details in production, a structured error handling middleware would provide more secure error messages for users and useful logs for developers.**

   - I would agree my logging isn't ideal but the error handling seems pretty standard to me. I would appreciate an example of bad error handling.

### Final Thoughts:

I am very curious to know more about the process of the review and how it was conducted becuase the mistakes being made are quite bewildering.

1. **Nonexistent Files and Line Numbers:**  
   All (or almost all) references are made to files and line numbers that don’t exist in the codebase (e.g., `cms.js`, `courseModel.js`, `courseController.js`). This raises questions about whether the review was based on an accurate version of the project.

2. **Compiled Code Confusion:**  
   Certain comments, such as those about CSS practices, seem to suggest that the reviewer might have been analyzing compiled or minified code rather than the source files, which seems like a very odd thing to do (I am no expert so i might be wrong). However, this doesn’t fully explain the appearance of file names like `cms.js` or `courseModel.js`, which wouldn’t typically result from compilation.

3. **Potential Automated Review:**  
   The review reads as if parts of it might have been generated by an automated tool that was unable to reconcile actual implementation details with assumptions or generic recommendations. This could explain the misaligned file names and line numbers.
