import { Card, Stack, Text, Group, Badge, Checkbox } from "@mantine/core";
import type { LotOption } from "..";
import Scrollable from "../../../../../components/Scrollable";
import { useState } from "react";

interface LotCardSelectorProps {
  lots: LotOption[];
  selected: string;
  onSelect: (code: string) => void;
  isMultiple?: boolean;
}

const PlotCardSelector: React.FC<LotCardSelectorProps> = ({
  lots,
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
    <Scrollable h={180}>
      <Group gap="md" p={"xs"} wrap="nowrap">
        {lots.map((lot) => (
          <Card
            key={lot.code}
            withBorder
            radius="md"
            h={170}
            shadow={selected.includes(lot.code) ? "md" : "xs"}
            style={{
              borderColor: selected.includes(lot.code) ? "green" : undefined,
              cursor: "pointer",
              minWidth: 300,
              position: "relative",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onClick={() => onSelect(lot.code)}
          >
            <Stack gap={6}>
              <Group justify="space-between">
                <Text fw={500}>{lot.name}</Text>
                <Group>
                  <Badge color="gray">{lot.code}</Badge>
                  {isMultiple && (
                    <Checkbox
                      radius={4}
                      checked={selected.includes(lot.code)}
                    />
                  )}
                </Group>
              </Group>

              <Text size="sm">
                <strong>Cây trồng chính:</strong> {lot.crop}
              </Text>

              <Group gap="md">
                <Text size="sm">
                  <strong>Diện tích:</strong> {lot.area}
                </Text>
              </Group>

              <Group gap="md">
                <Text size="sm">
                  <strong>Canh tác:</strong> {lot.farming}
                </Text>
              </Group>

              <Group gap="xs">
                <Text size="sm">
                  <strong>Địa hình:</strong>
                </Text>
                <Badge variant="light" color="green">
                  {lot.slope}
                </Badge>
              </Group>
            </Stack>
          </Card>
        ))}
      </Group>
    </Scrollable>
  );
};

export default PlotCardSelector;
