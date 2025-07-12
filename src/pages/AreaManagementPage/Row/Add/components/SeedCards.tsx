import { Card, Group, Stack, Text, Image, Badge } from "@mantine/core";
import type { SeedOption } from "..";

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
    <Group gap="md" wrap="wrap" align="flex-start">
      {seeds.map((seed) => (
        <Card
          key={seed.code}
          withBorder
          radius="md"
          shadow={selected === seed.code ? "md" : "xs"}
          style={{
            borderColor: selected === seed.code ? "teal" : undefined,
            cursor: "pointer",
            width: 320,
          }}
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
  );
};

export default SeedCards;
