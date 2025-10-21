import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type EmailProps = {
  otpCode: string;
};

export default function EmailVerificationOtp({ otpCode }: EmailProps) {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: "#007291",
            },
          },
        },
      }}
    >
      <Html>
        <Head />
        <Preview>Confirmation de votre email avec un code OTP</Preview>
        <Body className="bg-white text-gray-900">
          <Container className="mx-auto max-w-2xl bg-gray-100 p-5">
            <Section className="bg-white">
              <Section className="p-6 md:p-9">
                <Heading className="mb-4 text-xl font-bold text-gray-900">
                  Confirmation de votre adresse email
                </Heading>
                <Text className="mb-6 text-sm text-gray-700">
                  Merci de confirmer votre adresse email en utilisant le code
                  OTP ci-dessous.
                </Text>

                <Text className="text-2xl font-bold text-blue-600">
                  {otpCode}
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}
