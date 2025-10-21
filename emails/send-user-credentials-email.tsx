import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface EmailProps {
  username: string;
  password: string;
}

export default function SendUserCredentialsEmail({
  username,
  password,
}: EmailProps) {
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
        <Preview>Paramètres de connexion</Preview>
        <Body className="bg-white text-gray-900">
          <Container className="max-w-2xl mx-auto p-5 bg-gray-200">
            <Section className="bg-white">
              <Section className="p-6">
                <Text className="text-sm text-gray-800 mb-6">
                  Bonjour M./Mme,
                </Text>
                <Text>
                  Veuillez trouver ci-dessous vos paramètres de connexion pour
                  accéder à votre espace personnel. Nous vous recommandons de
                  garder ces informations en sécurité.
                </Text>
                <Section className="mb-2">
                  <Text className="text-sm font-bold text-gray-800">
                    Identifiant :
                  </Text>
                  <Text className="text-base text-gray-800">{username}</Text>
                </Section>
                <Section className="mb-2">
                  <Text className="text-sm font-bold text-gray-800">
                    Mot de passe :
                  </Text>
                  <Text className="text-base text-gray-800">{password}</Text>
                </Section>
              </Section>
              <Hr className="border-t border-gray-300" />
              <Section className="p-6 md:p-9">
                <Text className="text-sm text-red-500 italic">
                  Veuillez ne pas partager vos identifiants avec qui que ce
                  soit.
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}
