import { Card, Stack, Text, Group, Badge } from "@mantine/core";
import type { LotOption } from "..";
import Scrollable from "../../../../../components/Scrollable";

interface LotCardSelectorProps {
  lots: LotOption[];
  selected: string;
  onSelect: (code: string) => void;
}

const PlotCardSelector: React.FC<LotCardSelectorProps> = ({
  lots,
  selected,
  onSelect,
}) => {
  return (
    <Scrollable h={180}>
      <Group gap="md" p={"xs"} wrap="nowrap">
        {lots.map((lot) => (
          <Card
            key={lot.code}
            withBorder
            radius="md"
            h={170}
            shadow={selected === lot.code ? "md" : "xs"}
            style={{
              borderColor: selected === lot.code ? "teal" : undefined,
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
                <Badge color="gray">{lot.code}</Badge>
              </Group>

              <Text size="sm">
                <strong>Cây trồng chính:</strong> {lot.crop}
              </Text>

              <Group gap="md">
                <Text size="sm">
                  <strong>Diện tích:</strong> {lot.area}
                </Text>
                <Text size="sm">
                  <strong>Số hàng:</strong> {lot.rows}
                </Text>
              </Group>

              <Group gap="md">
                <Text size="sm">
                  <strong>Tưới:</strong> {lot.irrigation}
                </Text>
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
