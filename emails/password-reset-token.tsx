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

interface EmailProps {
  confirmLink: string;
}

export default function PasswordResetToken({ confirmLink }: EmailProps) {
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
        <Preview>REINITIALISATION DE MOT DE PASSE</Preview>
        <Body className="bg-white text-gray-900">
          <Container className="mx-auto max-w-2xl bg-gray-100 p-5">
            <Section className="bg-white">
              <Section className="p-6 md:p-9">
                <Heading className="mb-4 text-xl font-bold text-gray-900">
                  REINITIALISATION DE MOT DE PASSE
                </Heading>
                <Section className="mb-4">
                  <Text className="text-sm font-semibold text-gray-800">
                    Cliquez sur le lien ci-dessous pour réinitialiser votre mot
                    de passe :
                  </Text>
                  <Text className="text-base text-blue-600">
                    <a href={confirmLink} target="_blank">
                      Réinitialiser mot de passe
                    </a>
                  </Text>
                </Section>
              </Section>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}
