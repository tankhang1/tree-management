import {
  Card,
  Group,
  Stack,
  Text,
  Image,
  Badge,
  Checkbox,
  ActionIcon,
} from "@mantine/core";
import Scrollable from "../../../../../components/Scrollable";
import { useState } from "react";
import { IconTrash } from "@tabler/icons-react";

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
  isCheckbox?: boolean;
  isTouchable?: boolean;
  isDelete?: boolean;
  onSelect: (code: string) => void;
}

const SeedCards: React.FC<SeedCardSelectorProps> = ({
  seeds,
  isTouchable = true,
  isCheckbox = true,
  isDelete = false,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const onSelect = (code: string) => {
    if (!isTouchable) return;
    setSelectedIds((prev) =>
      prev.includes(code) ? prev.filter((id) => id !== code) : [...prev, code]
    );
  };
  return (
    <Scrollable h={320}>
      <Group p={"xs"} gap="md" wrap="nowrap" align="flex-start">
        {seeds.map((seed) => (
          <Card
            h={300}
            key={seed.code}
            withBorder
            radius="md"
            style={{
              cursor: "pointer",
              width: 320,
              position: "relative",
              transition: "transform 0.2s ease",
              borderColor: selectedIds.includes(seed.code)
                ? "green"
                : undefined,
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
                <Group gap={"xs"}>
                  <Badge color="gray">{seed.code}</Badge>
                  {isCheckbox && (
                    <Checkbox
                      checked={selectedIds.includes(seed.code)}
                      onChange={() => onSelect(seed.code)}
                      radius={4}
                    />
                  )}
                </Group>
              </Group>
              <Text size="sm">
                <strong>Loại cây:</strong> {seed.cropName}
              </Text>
              <Text size="sm" c="dimmed">
                {seed.description}
              </Text>
              {isDelete && (
                <ActionIcon
                  pos={"absolute"}
                  right={10}
                  bottom={10}
                  color="red"
                  variant="light"
                  radius={4}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              )}
            </Stack>
          </Card>
        ))}
      </Group>
    </Scrollable>
  );
};

export default SeedCards;
