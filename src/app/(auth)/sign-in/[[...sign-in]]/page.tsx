import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] p-4">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: "bg-[#FF3366] hover:bg-[#E62E5C] text-white",
            card: "bg-black/50 border border-white/10 backdrop-blur-xl shadow-2xl shadow-[#FF3366]/20",
            headerTitle: "text-[#F5F5F5]",
            headerSubtitle: "text-gray-400",
            socialButtonsBlockButton: "border-white/10 text-[#F5F5F5] hover:bg-white/5",
            socialButtonsBlockButtonText: "font-semibold text-[#F5F5F5]",
            dividerLine: "bg-white/10",
            dividerText: "text-gray-400",
            formFieldLabel: "text-[#F5F5F5]",
            formFieldInput: "bg-black border-white/10 text-[#F5F5F5] focus:border-[#7C3AED] focus:ring-[#7C3AED]",
            footerActionText: "text-gray-400",
            footerActionLink: "text-[#7C3AED] hover:text-[#9D68FF]",
          },
        }}
      />
    </div>
  );
}
