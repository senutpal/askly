import { SignUp } from "@clerk/nextjs";

export const SignUpView = () => {
	return <SignUp path="/sign-up" routing="path" />;
};
