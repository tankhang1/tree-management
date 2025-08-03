import { Card, Group, Stack, Text, Image, Badge } from "@mantine/core";
import Scrollable from "../../../../../components/Scrollable";

interface SeedOption {
  code: string;
  cropName: string;
  seedName: string;
  description: string;
  image: string; // URL hoặc base64 string
}

interface SeedCardSelectorProps {
  seeds: SeedOption[];
  selected: string;
  onSelect: (code: string) => void;
}

const SeedCards: React.FC<SeedCardSelectorProps> = ({
  seeds,
  selected,
  onSelect,
}) => {
  return (
    <Scrollable h={320}>
      <Group p={"xs"} gap="md" wrap="nowrap" align="flex-start">
        {seeds.map((seed) => (
          <Card
            h={300}
            key={seed.code}
            withBorder
            radius="md"
            shadow={selected === seed.code ? "md" : "xs"}
            style={{
              borderColor: selected === seed.code ? "teal" : undefined,
              cursor: "pointer",
              width: 320,
              position: "relative",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onClick={() => onSelect(seed.code)}
          >
            <Stack gap="xs">
              <Image
                src={seed.image}
                alt={seed.seedName}
                height={140}
                radius="md"
              />
              <Group justify="space-between">
                <Text fw={500}>{seed.seedName}</Text>
                <Badge color="gray">{seed.code}</Badge>
              </Group>
              <Text size="sm">
                <strong>Loại cây:</strong> {seed.cropName}
              </Text>
              <Text size="sm" c="dimmed">
                {seed.description}
              </Text>
            </Stack>
          </Card>
        ))}
      </Group>
    </Scrollable>
  );
};

export default SeedCards;
