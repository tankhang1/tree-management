import { Card, Group, Text, Badge, Stack, Title } from "@mantine/core";

export interface LotCardProps {
  code: string;
  name: string;
  areaCode: string;
  zone: string;
  treeType: string;
  treeCount: number;
  areaSize: string;
  status: string;
  soilType: string;
  onClick?: () => void;
  isActive?: boolean;
}

const LotCard = ({
  code,
  name,
  areaCode,
  zone,
  treeType,
  treeCount,
  areaSize,
  soilType,
  onClick,
  isActive = false,
}: LotCardProps) => {
  return (
    <Card
      w={300}
      h={250}
      shadow="sm"
      radius="md"
      withBorder
      padding="md"
      style={{
        cursor: "pointer",
        position: "relative",
        transition: "transform 0.2s ease",
        borderColor: isActive ? "green" : undefined,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onClick={onClick}
    >
      <Stack gap="xs">
        <Group justify="space-between">
          <Title order={5}>{name}</Title>
          <Badge color="gray" variant="light">
            {code}
          </Badge>
        </Group>

        <Text size="sm">
          <strong>Thuộc khu vực:</strong> {areaCode}
        </Text>
        <Text size="sm">
          <strong>Vùng trồng:</strong> {zone}
        </Text>
        <Text size="sm">
          <strong>Loại cây:</strong> {treeType}
        </Text>
        <Text size="sm">
          <strong>Số lượng cây:</strong> {treeCount}
        </Text>
        <Text size="sm">
          <strong>Diện tích:</strong> {areaSize}
        </Text>
        <Text size="sm">
          <strong>Loại đất:</strong> {soilType}
        </Text>

        {/* <Badge
          color={status === "Đang canh tác" ? "green" : "red"}
          variant="filled"
        >
          {status}
        </Badge> */}
      </Stack>
    </Card>
  );
};

export default LotCard;
