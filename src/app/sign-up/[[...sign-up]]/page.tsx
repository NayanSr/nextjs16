import {SignUp } from "@clerk/nextjs";

const SignUpPage =async({searchParams}:{searchParams: {redirect_url?:string}}) => {
    const params= await searchParams;
    const redirectUrl= params.redirect_url || "/dashboard"
  return (
    <div className="pt-10 flex min-h-screen item-center justify-center bg-linear-to-br from-gray-50 to-gray-200">
        <SignUp appearance={{elements:{formButtonPrimary:"bg-blue-600 hover:bg-blue-700 text-sm",
            card:'shadow-xl'
        }}} signInUrl="/sign-in" afterSignInUrl={redirectUrl} redirectUrl={redirectUrl}   />
    </div>
  )
}

export default SignUpPage