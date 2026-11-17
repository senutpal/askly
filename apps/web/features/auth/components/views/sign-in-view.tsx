import { SignIn } from "@clerk/nextjs";

export const SignInView = () => {
	return <SignIn path="/sign-in" routing="path" />;
};
