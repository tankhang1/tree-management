import { Badge, Card, Group, Stack, Text } from "@mantine/core";
import type { LotOption } from "..";

interface LotCardSelectorProps {
  lots: LotOption[];
  selected: string;
  onSelect: (code: string) => void;
}

const PlotCards: React.FC<LotCardSelectorProps> = ({
  lots,
  selected,
  onSelect,
}) => {
  return (
    <Group gap="md" wrap="wrap" p={"xs"}>
      {lots.map((lot) => (
        <Card
          key={lot.code}
          withBorder
          radius="md"
          shadow={selected === lot.code ? "md" : "xs"}
          style={{
            borderColor: selected === lot.code ? "teal" : undefined,
            cursor: "pointer",
            minWidth: 280,
            position: "relative",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.02)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onClick={() => onSelect(lot.code)}
        >
          <Stack gap={4}>
            <Group justify="space-between">
              <Text fw={500}>{lot.name}</Text>
              <Badge color="gray">{lot.code}</Badge>
            </Group>
            <Text size="sm">
              <strong>Vùng:</strong> {lot.zone}
            </Text>
            <Text size="sm">
              <strong>Khu vực:</strong> {lot.area}
            </Text>
            <Text size="sm">
              <strong>Loại cây:</strong> {lot.treeType}
            </Text>
            <Group gap="md">
              <Text size="sm">
                <strong>Số cây:</strong> {lot.treeCount}
              </Text>
              <Text size="sm">
                <strong>Diện tích:</strong> {lot.areaSize}
              </Text>
            </Group>
            <Text size="sm">
              <strong>Đất:</strong> {lot.soilType}
            </Text>
            <Badge
              color={
                lot.status === "Đang canh tác"
                  ? "green"
                  : lot.status === "Tạm ngưng"
                  ? "yellow"
                  : "gray"
              }
              variant="light"
              mt="xs"
            >
              {lot.status}
            </Badge>
          </Stack>
        </Card>
      ))}
    </Group>
  );
};

export default PlotCards;
