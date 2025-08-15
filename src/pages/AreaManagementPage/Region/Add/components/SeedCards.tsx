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
import type { SeedOption } from "..";
import Scrollable from "../../../../../components/Scrollable";
import { useState } from "react";
import { IconTrash } from "@tabler/icons-react";

interface SeedCardSelectorProps {
  seeds: SeedOption[];
  selected: string;
  onSelect: (code: string) => void;
  isMultiple?: boolean;
  isTouchable?: boolean;
  isDelete?: boolean;
}

const SeedCards: React.FC<SeedCardSelectorProps> = ({
  seeds,
  isMultiple = false,
  isDelete = false,
  isTouchable = true,
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const onSelect = (code: string) => {
    if (!isTouchable) return;
    if (isMultiple) {
      setSelected((prev) =>
        prev.includes(code) ? prev.filter((id) => id !== code) : [...prev, code]
      );
    } else {
      setSelected([code]);
    }
  };
  return (
    <Scrollable h={100}>
      <Group gap="md" wrap="nowrap" align="flex-start" p={"xs"}>
        {seeds.map((seed) => (
          <Card
            w={400}
            h={100}
            key={seed.code}
            p={0}
            withBorder
            radius="md"
            style={{
              cursor: "pointer",
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
            <Group gap="xs" align="flex-start">
              <Image
                src={seed.image}
                alt={seed.seedName}
                height={100}
                w={"40%"}
                fit="cover"
              />
              <Stack flex={1} gap={"xs"} p={"xs"}>
                <Group justify="space-between">
                  <Text fw={500}>{seed.seedName}</Text>
                  <Group gap={"xs"}>
                    <Badge color="gray">{seed.code}</Badge>
                    {isMultiple && (
                      <Checkbox
                        radius={4}
                        onChange={() => {}}
                        checked={selected.includes(seed.code)}
                      />
                    )}
                  </Group>
                </Group>
                <Text size="sm">
                  <strong>Loại cây:</strong> {seed.cropName}
                </Text>
              </Stack>
              {/* <Text size="sm" c="dimmed">
                {seed.description}
              </Text> */}
              {isDelete && (
                <ActionIcon
                  pos={"absolute"}
                  bottom={10}
                  right={10}
                  color="red"
                  variant="light"
                  radius={4}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              )}
            </Group>
          </Card>
        ))}
      </Group>
    </Scrollable>
  );
};

export default SeedCards;
