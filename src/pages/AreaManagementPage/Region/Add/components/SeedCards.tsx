import { Card, Group, Stack, Text, Image, Badge } from "@mantine/core";
import type { SeedOption } from "..";
import Scrollable from "../../../../../components/Scrollable";
import { useState } from "react";

interface SeedCardSelectorProps {
  seeds: SeedOption[];
  selected: string;
  onSelect: (code: string) => void;
  isMultiple?: boolean;
}

const SeedCards: React.FC<SeedCardSelectorProps> = ({
  seeds,
  isMultiple = false,
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const onSelect = (code: string) => {
    if (isMultiple) {
      setSelected((prev) =>
        prev.includes(code) ? prev.filter((id) => id !== code) : [...prev, code]
      );
    } else {
      setSelected([code]);
    }
  };
  return (
    <Scrollable h={280}>
      <Group gap="md" wrap="nowrap" align="flex-start" p={"xs"}>
        {seeds.map((seed) => (
          <Card
            w={250}
            h={280}
            key={seed.code}
            withBorder
            radius="md"
            style={{
              cursor: "pointer",
              width: 320,
              position: "relative",
              transition: "transform 0.2s ease",
              borderColor: selected.includes(seed.code) ? "green" : undefined,
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
